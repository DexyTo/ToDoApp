from flask import Flask
from flask_restful import Api
from config import Config
from extensions import db, cors
from resources import TaskListResource, TaskResource, TaskImageUploadResource, TaskImageUrlResource
import logging

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    db.init_app(app)
    cors.init_app(app, resources={r"/api/*": {"origins": "*"}})
    
    logging.basicConfig(level=logging.INFO)
    
    with app.app_context():
        try:
            inspector = db.inspect(db.engine)
            if not inspector.has_table('tasks'):
                db.create_all()
                app.logger.info("Таблица tasks успешно создана")
            else:
                app.logger.info("Таблица tasks уже существует")
        except Exception as e:
            app.logger.error(f"Ошбика создания таблицы tasks: {e}")
    
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
    app.run(debug=False, host='0.0.0.0', port=5000)