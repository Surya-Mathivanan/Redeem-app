from flask import Flask, render_template, request, redirect, url_for, session, flash, jsonify
from pymongo import MongoClient, ASCENDING
from pymongo.errors import DuplicateKeyError
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
from bson import ObjectId
import os

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY', 'your-secret-key-change-this-in-production')

# MongoDB configuration
MONGO_URI = os.environ.get('MONGO_URI', 'mongodb+srv://kit26ad59:ld40fTki6Q0BDjXG@cluster0.ge3lxlk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
DATABASE_NAME = 'redeem_codes_db'

def get_db_connection():
    """Get MongoDB database connection"""
    print("Connecting to MongoDB...")
    try:
        # Clean connection for MongoDB Atlas - remove conflicting SSL options
        client = MongoClient(
            MONGO_URI,
            serverSelectionTimeoutMS=10000,
            socketTimeoutMS=30000,
            connectTimeoutMS=30000,
            maxPoolSize=50,
            retryWrites=True,
            w='majority'
            # Note: No SSL options needed - MongoDB Atlas handles SSL automatically
        )
        
        # Test the connection
        client.admin.command('ping')
        db = client[DATABASE_NAME]
        print("Connected to MongoDB successfully!")
        return db
        
    except Exception as err:
        print(f"MongoDB connection error: {err}")
        print("Trying alternative connection method...")
        
        # Try with minimal configuration
        try:
            client = MongoClient(
                MONGO_URI,
                serverSelectionTimeoutMS=15000
            )
            
            client.admin.command('ping')
            db = client[DATABASE_NAME]
            print("Connected to MongoDB with minimal configuration!")
            return db
            
        except Exception as err2:
            print(f"Alternative connection also failed: {err2}")
            
            # Try with local MongoDB as fallback
            try:
                print("Trying local MongoDB connection...")
                local_client = MongoClient('mongodb://localhost:27017/')
                local_client.admin.command('ping')
                local_db = local_client[DATABASE_NAME]
                print("Connected to local MongoDB!")
                return local_db
            except Exception as err3:
                print(f"Local MongoDB connection failed: {err3}")
                return None

def init_database():
    """Initialize MongoDB collections and indexes"""
    try:
        db = get_db_connection()
        if db is None:
            print("Warning: Could not connect to MongoDB. Server will start but database operations will fail.")
            return
        
        print("Creating database indexes...")
        
        # Create collections and indexes
        try:
            # Users collection - unique email index
            db.users.create_index([("email", ASCENDING)], unique=True)
            print("✓ Users collection index created")
        except Exception as e:
            print(f"Users index warning: {e}")
        
        try:
            # Redeem codes collection indexes
            db.redeem_codes.create_index([("user_id", ASCENDING)])
            db.redeem_codes.create_index([("created_at", ASCENDING)])
            print("✓ Redeem codes collection indexes created")
        except Exception as e:
            print(f"Redeem codes index warning: {e}")
        
        try:
            # Copies collection - compound unique index
            db.copies.create_index([("user_id", ASCENDING), ("redeem_code_id", ASCENDING)], unique=True)
            db.copies.create_index([("redeem_code_id", ASCENDING)])
            db.copies.create_index([("copied_at", ASCENDING)])
            print("✓ Copies collection indexes created")
        except Exception as e:
            print(f"Copies index warning: {e}")
        
        try:
            # User suspensions collection indexes
            db.user_suspensions.create_index([("user_id", ASCENDING)])
            db.user_suspensions.create_index([("suspended_until", ASCENDING)])
            db.user_suspensions.create_index([("is_active", ASCENDING)])
            print("✓ User suspensions collection indexes created")
        except Exception as e:
            print(f"User suspensions index warning: {e}")
        
        try:
            # Misuse logs collection indexes
            db.misuse_logs.create_index([("user_id", ASCENDING)])
            db.misuse_logs.create_index([("created_at", ASCENDING)])
            print("✓ Misuse logs collection indexes created")
        except Exception as e:
            print(f"Misuse logs index warning: {e}")
        
        print("Database initialized successfully!")
        
    except Exception as e:
        print(f"Database initialization error: {e}")

def check_user_suspension(user_id):
    """Check if user is currently suspended"""
    try:
        db = get_db_connection()
        if db is not None:
            suspension = db.user_suspensions.find_one({
                "user_id": ObjectId(user_id),
                "is_active": True,
                "suspended_until": {"$gt": datetime.now()}
            }, sort=[("suspended_at", -1)])
            
            if suspension:
                return (suspension["suspended_until"], suspension["reason"])
        return None
    except Exception as e:
        print(f"Error checking user suspension: {e}")
        return None

def log_misuse_activity(user_id, action_type, details):
    """Log misuse activity for monitoring"""
    try:
        db = get_db_connection()
        if db is not None:
            db.misuse_logs.insert_one({
                "user_id": ObjectId(user_id),
                "action_type": action_type,
                "details": details,
                "created_at": datetime.now()
            })
    except Exception as e:
        print(f"Error logging misuse activity: {e}")

def check_rapid_copying_pattern(user_id):
    """Check if user has been copying codes too rapidly"""
    try:
        db = get_db_connection()
        if db is not None:
            # Get last 5 copies by this user in the last 2 minutes
            two_minutes_ago = datetime.now() - timedelta(minutes=2)
            recent_copies = list(db.copies.find({
                "user_id": ObjectId(user_id),
                "copied_at": {"$gte": two_minutes_ago}
            }).sort("copied_at", -1).limit(5))
            
            if len(recent_copies) >= 3:
                # Check if any 3 consecutive copies were within 20 seconds of each other
                rapid_sequences = 0
                
                for i in range(len(recent_copies) - 2):
                    time1 = recent_copies[i]["copied_at"]
                    time2 = recent_copies[i + 1]["copied_at"]
                    time3 = recent_copies[i + 2]["copied_at"]
                    
                    # Check if all 3 copies happened within 60 seconds total
                    if (time1 - time3).total_seconds() <= 60:
                        # Check if any two consecutive copies were within 20 seconds
                        if ((time1 - time2).total_seconds() <= 20 or 
                            (time2 - time3).total_seconds() <= 20):
                            rapid_sequences += 1
                
                if rapid_sequences >= 1:
                    return True, len(recent_copies)
            
            return False, len(recent_copies) if recent_copies else 0
        
        return False, 0
    except Exception as e:
        print(f"Error checking rapid copying pattern: {e}")
        return False, 0

def suspend_user(user_id, reason):
    """Suspend user until end of day"""
    try:
        db = get_db_connection()
        if db is not None:
            # Calculate suspension until end of day
            tomorrow = datetime.now().replace(hour=23, minute=59, second=59, microsecond=999999)
            
            # Deactivate any existing suspensions
            db.user_suspensions.update_many(
                {"user_id": ObjectId(user_id), "is_active": True},
                {"$set": {"is_active": False}}
            )
            
            # Add new suspension
            db.user_suspensions.insert_one({
                "user_id": ObjectId(user_id),
                "reason": reason,
                "suspended_at": datetime.now(),
                "suspended_until": tomorrow,
                "is_active": True
            })
            
            # Log the suspension
            log_misuse_activity(user_id, 'SUSPENDED', f'Reason: {reason}')
            
            return True
        return False
    except Exception as e:
        print(f"Error suspending user: {e}")
        return False

@app.route('/')
def index():
    if 'user_id' in session:
        return redirect(url_for('home'))
    return redirect(url_for('login'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        
        db = get_db_connection()
        if db is not None:
            try:
                user = db.users.find_one({"email": email})
                
                if user and check_password_hash(user["password"], password):
                    # Check if user is suspended
                    suspension = check_user_suspension(user["_id"])
                    if suspension:
                        suspended_until = suspension[0]
                        reason = suspension[1]
                        flash(f'Your account is suspended until {suspended_until.strftime("%Y-%m-%d %H:%M:%S")}. Reason: {reason}', 'error')
                        return render_template('login.html')
                    
                    session['user_id'] = str(user["_id"])
                    session['user_name'] = user["name"]
                    session['user_email'] = email
                    flash('Login successful!', 'success')
                    return redirect(url_for('home'))
                else:
                    flash('Invalid email or password. Please register if you don\'t have an account.', 'error')
            except Exception as e:
                print(f"Login error: {e}")
                flash('Login failed. Please try again.', 'error')
        else:
            flash('Database connection error. Please try again later.', 'error')
    
    return render_template('login.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        name = request.form['name']
        email = request.form['email']
        password = request.form['password']
        
        db = get_db_connection()
        if db is not None:
            try:
                # Check if email already exists
                if db.users.find_one({"email": email}):
                    flash('Email already registered. Please login.', 'error')
                    return redirect(url_for('login'))
                
                hashed_password = generate_password_hash(password)
                
                result = db.users.insert_one({
                    "name": name,
                    "email": email,
                    "password": hashed_password,
                    "created_at": datetime.now()
                })
                
                user_id = str(result.inserted_id)
                session['user_id'] = user_id
                session['user_name'] = name
                session['user_email'] = email
                flash('Registration successful!', 'success')
                return redirect(url_for('home'))
            except DuplicateKeyError:
                flash('Email already registered. Please login.', 'error')
                return redirect(url_for('login'))
            except Exception as e:
                print(f"Registration error: {e}")
                flash('Registration failed. Please try again.', 'error')
        else:
            flash('Database connection error. Please try again later.', 'error')
    
    return render_template('register.html')

@app.route('/home')
def home():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    
    # Check if user is suspended
    suspension = check_user_suspension(session['user_id'])
    if suspension:
        session.clear()
        flash(f'Your account has been suspended for misuse. Suspension ends: {suspension[0].strftime("%Y-%m-%d %H:%M:%S")}', 'error')
        return redirect(url_for('login'))
    
    redeem_codes = []
    db = get_db_connection()
    if db is not None:
        try:
            # Get redeem codes from last 7 days with copy counts and user copy status
            seven_days_ago = datetime.now() - timedelta(days=7)
            
            # Use aggregation pipeline to get the data we need
            pipeline = [
                {
                    "$match": {
                        "created_at": {"$gte": seven_days_ago}
                    }
                },
                {
                    "$lookup": {
                        "from": "users",
                        "localField": "user_id",
                        "foreignField": "_id",
                        "as": "user_info"
                    }
                },
                {
                    "$lookup": {
                        "from": "copies",
                        "localField": "_id",
                        "foreignField": "redeem_code_id",
                        "as": "copies"
                    }
                },
                {
                    "$addFields": {
                        "total_copies": {"$size": "$copies"},
                        "user_copied": {
                            "$in": [ObjectId(session['user_id']), "$copies.user_id"]
                        }
                    }
                },
                {
                    "$match": {
                        "total_copies": {"$lt": 5}
                    }
                },
                {
                    "$sort": {
                        "total_copies": 1,
                        "created_at": -1
                    }
                }
            ]
            
            redeem_codes_cursor = db.redeem_codes.aggregate(pipeline)
            
            for code in redeem_codes_cursor:
                user_name = code["user_info"][0]["name"] if code["user_info"] else "Unknown"
                redeem_codes.append((
                    str(code["_id"]),           # id
                    code["title"],              # title
                    code["code"],               # code
                    code["created_at"],         # created_at
                    user_name,                  # user name
                    code["total_copies"],       # total_copies
                    1 if code["user_copied"] else 0  # user_copied
                ))
        except Exception as e:
            print(f"Error fetching redeem codes: {e}")
            flash('Error loading codes. Please try again.', 'error')
    
    return render_template('home.html', redeem_codes=redeem_codes)

@app.route('/account')
def account():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    
    # Check if user is suspended
    suspension = check_user_suspension(session['user_id'])
    if suspension:
        session.clear()
        flash(f'Your account has been suspended for misuse. Suspension ends: {suspension[0].strftime("%Y-%m-%d %H:%M:%S")}', 'error')
        return redirect(url_for('login'))
    
    return render_template('account.html')

@app.route('/add_code', methods=['GET', 'POST'])
def add_code():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    
    # Check if user is suspended
    suspension = check_user_suspension(session['user_id'])
    if suspension:
        session.clear()
        flash(f'Your account has been suspended for misuse. Suspension ends: {suspension[0].strftime("%Y-%m-%d %H:%M:%S")}', 'error')
        return redirect(url_for('login'))
    
    if request.method == 'POST':
        title = request.form['title']
        code = request.form['code']
        
        db = get_db_connection()
        if db is not None:
            try:
                db.redeem_codes.insert_one({
                    "title": title,
                    "code": code,
                    "user_id": ObjectId(session['user_id']),
                    "created_at": datetime.now()
                })
                flash('Redeem code added successfully!', 'success')
                return redirect(url_for('home'))
            except Exception as e:
                print(f"Error adding code: {e}")
                flash('Error adding code. Please try again.', 'error')
        else:
            flash('Database connection error. Please try again later.', 'error')
    
    return render_template('add_code.html')

@app.route('/dashboard')
def dashboard():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    
    # Check if user is suspended
    suspension = check_user_suspension(session['user_id'])
    if suspension:
        session.clear()
        flash(f'Your account has been suspended for misuse. Suspension ends: {suspension[0].strftime("%Y-%m-%d %H:%M:%S")}', 'error')
        return redirect(url_for('login'))
    
    total_copies = 0
    added_codes = 0
    
    db = get_db_connection()
    if db is not None:
        try:
            total_copies = db.copies.count_documents({"user_id": ObjectId(session['user_id'])})
            added_codes = db.redeem_codes.count_documents({"user_id": ObjectId(session['user_id'])})
        except Exception as e:
            print(f"Error fetching dashboard data: {e}")
    
    return render_template('dashboard.html', total_copies=total_copies, added_codes=added_codes)

@app.route('/archive')
def archive():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    
    # Check if user is suspended
    suspension = check_user_suspension(session['user_id'])
    if suspension:
        session.clear()
        flash(f'Your account has been suspended for misuse. Suspension ends: {suspension[0].strftime("%Y-%m-%d %H:%M:%S")}', 'error')
        return redirect(url_for('login'))
    
    archived_codes = []
    db = get_db_connection()
    if db is not None:
        try:
            seven_days_ago = datetime.now() - timedelta(days=7)
            
            # Get expired codes (older than 7 days)
            expired_pipeline = [
                {
                    "$match": {
                        "created_at": {"$lt": seven_days_ago}
                    }
                },
                {
                    "$lookup": {
                        "from": "users",
                        "localField": "user_id",
                        "foreignField": "_id",
                        "as": "user_info"
                    }
                },
                {
                    "$lookup": {
                        "from": "copies",
                        "localField": "_id",
                        "foreignField": "redeem_code_id",
                        "as": "copies"
                    }
                },
                {
                    "$addFields": {
                        "total_copies": {"$size": "$copies"},
                        "user_copied": {
                            "$in": [ObjectId(session['user_id']), "$copies.user_id"]
                        },
                        "status": "Expired"
                    }
                }
            ]
            
            # Get exhausted codes (5 or more copies)
            exhausted_pipeline = [
                {
                    "$lookup": {
                        "from": "copies",
                        "localField": "_id",
                        "foreignField": "redeem_code_id",
                        "as": "copies"
                    }
                },
                {
                    "$addFields": {
                        "total_copies": {"$size": "$copies"}
                    }
                },
                {
                    "$match": {
                        "total_copies": {"$gte": 5}
                    }
                },
                {
                    "$lookup": {
                        "from": "users",
                        "localField": "user_id",
                        "foreignField": "_id",
                        "as": "user_info"
                    }
                },
                {
                    "$addFields": {
                        "user_copied": {
                            "$in": [ObjectId(session['user_id']), "$copies.user_id"]
                        },
                        "status": "Exhausted"
                    }
                }
            ]
            
            # Get expired codes
            for code in db.redeem_codes.aggregate(expired_pipeline):
                user_name = code["user_info"][0]["name"] if code["user_info"] else "Unknown"
                archived_codes.append((
                    str(code["_id"]),           # id
                    code["title"],              # title
                    code["code"],               # code
                    code["created_at"],         # created_at
                    user_name,                  # user name
                    code["total_copies"],       # total_copies
                    1 if code["user_copied"] else 0,  # user_copied
                    code["status"]              # status
                ))
            
            # Get exhausted codes
            for code in db.redeem_codes.aggregate(exhausted_pipeline):
                user_name = code["user_info"][0]["name"] if code["user_info"] else "Unknown"
                archived_codes.append((
                    str(code["_id"]),           # id
                    code["title"],              # title
                    code["code"],               # code
                    code["created_at"],         # created_at
                    user_name,                  # user name
                    code["total_copies"],       # total_copies
                    1 if code["user_copied"] else 0,  # user_copied
                    code["status"]              # status
                ))
            
            # Sort by created_at descending
            archived_codes.sort(key=lambda x: x[3], reverse=True)
        except Exception as e:
            print(f"Error fetching archived codes: {e}")
            flash('Error loading archived codes. Please try again.', 'error')
    
    return render_template('archive.html', archived_codes=archived_codes)

@app.route('/copy_code', methods=['POST'])
def copy_code():
    if 'user_id' not in session:
        return jsonify({'success': False, 'message': 'Not logged in'})
    
    user_id = session['user_id']
    
    # Check if user is suspended
    suspension = check_user_suspension(user_id)
    if suspension:
        session.clear()
        return jsonify({
            'success': False, 
            'message': 'Account suspended for misuse',
            'redirect': '/login'
        })
    
    if not request.json:
        return jsonify({'success': False, 'message': 'Invalid request data'})
    
    redeem_code_id = request.json.get('redeem_code_id')
    
    # Check for rapid copying pattern BEFORE processing the copy
    is_rapid, recent_count = check_rapid_copying_pattern(user_id)
    
    if is_rapid:
        # Log the misuse attempt
        log_misuse_activity(user_id, 'RAPID_COPYING_DETECTED', 
                          f'Attempted to copy code {redeem_code_id} with {recent_count} recent copies')
        
        # Suspend the user
        suspend_user(user_id, 'Rapid copying detected - potential misuse of platform')
        
        # Clear session to force logout
        session.clear()
        
        return jsonify({
            'success': False,
            'message': 'You have misused this platform by copying codes too rapidly. Your account has been temporarily suspended for the rest of the day.',
            'suspended': True,
            'redirect': '/login'
        })
    
    db = get_db_connection()
    if db is not None:
        try:
            # Check current copy count
            current_copies = db.copies.count_documents({"redeem_code_id": ObjectId(redeem_code_id)})
            
            if current_copies >= 5:
                return jsonify({'success': False, 'message': 'Copy limit reached'})
            
            # Try to insert the copy record
            db.copies.insert_one({
                "user_id": ObjectId(user_id),
                "redeem_code_id": ObjectId(redeem_code_id),
                "copied_at": datetime.now()
            })
            
            # Get updated copy count
            copy_count = db.copies.count_documents({"redeem_code_id": ObjectId(redeem_code_id)})
            
            # Log successful copy
            log_misuse_activity(user_id, 'CODE_COPIED', f'Successfully copied code {redeem_code_id}')
            
            return jsonify({'success': True, 'copy_count': copy_count})
        except DuplicateKeyError:
            return jsonify({'success': False, 'message': 'Already copied'})
        except Exception as e:
            print(f"Error copying code: {e}")
            return jsonify({'success': False, 'message': 'Error copying code'})
    
    return jsonify({'success': False, 'message': 'Database connection error'})

@app.route('/logout')
def logout():
    session.clear()
    flash('Logged out successfully!', 'success')
    return redirect(url_for('login'))

# Error handlers
@app.errorhandler(404)
def not_found_error(error):
    return render_template('404.html'), 404

@app.errorhandler(500)
def internal_error(error):
    return render_template('500.html'), 500

if __name__ == '__main__':
    print("Initializing database...")
    init_database()
    print("Starting Flask server...")
    
    # Use environment variables for configuration
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_DEBUG', 'True').lower() == 'true'
    
    app.run(host='0.0.0.0', port=port, debug=debug)
