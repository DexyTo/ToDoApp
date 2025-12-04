from flask import Flask
from flask_restful import Api
from config import Config
from extensions import db, cors
from resources import TaskListResource, TaskResource, TaskImageUploadResource, TaskImageUrlResource
import logging

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Initialize extensions
    db.init_app(app)
    cors.init_app(app, resources={r"/api/*": {"origins": "*"}})
    
    # Setup logging
    logging.basicConfig(level=logging.INFO)
    
    # Create tables
    with app.app_context():
        try:
            inspector = db.inspect(db.engine)
            if not inspector.has_table('tasks'):
                db.create_all()
                app.logger.info("Database tables created successfully")
            else:
                app.logger.info("Database tables already exist")
        except Exception as e:
            app.logger.error(f"Error creating database tables: {e}")
            # Для MySQL можно попробовать альтернативный подход
            try:
                db.create_all()
            except Exception as e2:
                app.logger.warning(f"Tables might already exist: {e2}")
    
    # Setup API routes
    api = Api(app, prefix='/api')
    
    api.add_resource(TaskListResource, '/tasks')
    api.add_resource(TaskResource, '/tasks/<int:task_id>')
    api.add_resource(TaskImageUploadResource, '/tasks/<int:task_id>/upload_image')
    api.add_resource(TaskImageUrlResource, '/tasks/<int:task_id>/image_url')
    
    @app.route('/health')
    def health():
        return {'status': 'healthy'}, 200
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, host='0.0.0.0', port=5000)