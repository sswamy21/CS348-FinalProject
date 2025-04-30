import datetime
from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Integer, String, and_, bindparam, delete, insert, select, update, func
from flask_migrate import Migrate
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///mydb.db"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
migrate = Migrate(app, db)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(30), nullable=False)
    
class Application(db.Model):
    id = db.Column(db.Integer, primary_key=True, index=True)
    position = db.Column(db.String(80), nullable=False)
    company = db.Column(db.String(80), nullable=False)
    location = db.Column(db.String(80), nullable=False, default="Multiple")
    status = db.Column(db.String(30), nullable=False, index=True)
    salary = db.Column(db.Integer, nullable=True, index=True)
    date_applied = db.Column(db.Date, default=datetime.date.today, nullable=True, index=True)

    @property
    def to_json(self):
       return {
           "app_id" : self.id,
           "position" : self.position,
           "company" : self.company,
           "location" : self.location,
           "status" : self.status,
           "salary" : self.salary,
           "date_applied" : self.date_applied
       }

if not os.path.exists('mydb.db'):
   with app.app_context():
       db.create_all()


@app.route('/applications', methods=['GET'])
def get_applications():
        try:
            stmt = select(Application).order_by(Application.date_applied)
            result = db.session.execute(stmt).scalars().all()
            applications = [application.to_json for application in result]
            return jsonify(applications), 200
        except Exception:
            return {"error" : "Could not get applications!"}, 500
        
@app.route('/applications/<int:app_id>', methods=['GET'])
def get_application(app_id):
        try:
            stmt = select(Application).where(Application.id == bindparam("app_id"))
            result = db.session.execute(stmt, {"app_id" : app_id}).scalars().first()
            result = result.to_json
            return jsonify(result), 200
        except Exception:
            return {"error" : "Could not get application!"}, 500

@app.route('/applications', methods=['PUT'])
def add_application():
    try:
        result = request.json
        date_applied = result.get('date_applied') 
        date_applied = datetime.datetime.strptime(date_applied, "%Y-%m-%d").date()
        newapp = Application(
                position = result.get('position'), 
                company = result.get('company'),                                
                location = result.get('location'),
                status = result.get('status'),
                salary = result.get('salary'),
                date_applied = date_applied
            )
        db.session.add(newapp)
        db.session.commit()
        return {'response': "Application added successfully!"}, 201
    except Exception:
        return {"error": "Could not add the application to the database!"}, 500

@app.route('/applications/<int:app_id>', methods=['DELETE'])
def delete_application(app_id):
    try:
        stmt = delete(Application).where(Application.id == bindparam("app_id"))
        db.session.execute(stmt, {"app_id" : app_id})
        db.session.commit()
        return {'response': "Application deleted successfully!"}, 204
    except Exception:
        return {"error" : "Could not delete application!"}, 500
    
@app.route('/applications/<int:app_id>', methods=['POST'])
def edit_application(app_id):
    try:
        result = request.json
        date_applied = result.get('date_applied') 
        date_applied = datetime.datetime.strptime(date_applied, "%Y-%m-%d").date()
        stmt =  (update(Application).where(Application.id == app_id) 
                    .values({
                        Application.position : result.get('position'),
                        Application.company: result.get('company'),                                
                        Application.location : result.get('location'),
                        Application.status : result.get('status'),
                        Application.salary : result.get('salary'),
                        Application.date_applied : date_applied
                    })
                )
        db.session.execute(stmt)
        db.session.commit()
        return {'response': "Application updated successfully!"}, 200
    except Exception:
        return {"error" : "Could not edit application!"}, 500
    
@app.route('/report')
def filter_applications():
    try:
        fromDate = request.args.get("from")
        toDate = request.args.get("to")
        if (fromDate):
            fromDate = datetime.datetime.strptime(fromDate, "%Y-%m-%d").date()
        else:
            fromDate = db.session.query(func.min(Application.date_applied)).scalar()
        if (toDate):
            toDate = datetime.datetime.strptime(toDate, "%Y-%m-%d").date()
        else:
            toDate = db.session.query(func.max(Application.date_applied)).scalar()

        status = request.args.get("status")
        stmt = db.session.query(Application)
        if (status and status !=  "All"):
            stmt = stmt.filter(Application.status == status)
        stmt = stmt.filter(
            and_( 
                Application.date_applied >= fromDate,
                Application.date_applied <= toDate
            )
        )
        result = stmt.all()
        applications = [application.to_json for application in result]

        return jsonify(applications), 200
    except Exception as e:
        return {"error" : str(e)}, 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)