from flask import request, jsonify
from flask_restful import Resource, reqparse
from models import Task
from extensions import db
from storage import storage


task_parser = reqparse.RequestParser()
task_parser.add_argument('title', type=str, required=True, help='Заголовок обязателен')
task_parser.add_argument('description', type=str, required=False)
task_parser.add_argument('is_completed', type=bool, required=False)

class TaskListResource(Resource):
    def get(self):
        tasks = Task.query.order_by(Task.created_at.desc()).all()
        return jsonify([task.to_dict() for task in tasks])
    
    def post(self):
        args = task_parser.parse_args()
        
        task = Task(
            title=args['title'],
            description=args.get('description', ''),
            is_completed=args.get('is_completed', False)
        )
        
        db.session.add(task)
        db.session.commit()
        
        return task.to_dict(), 201

class TaskResource(Resource):
    def get(self, task_id):
        task = Task.query.get_or_404(task_id)
        return task.to_dict()
    
    def put(self, task_id):
        task = Task.query.get_or_404(task_id)
        args = task_parser.parse_args()
        
        task.title = args['title']
        task.description = args.get('description', task.description)
        task.is_completed = args.get('is_completed', task.is_completed)
        
        db.session.commit()
        return task.to_dict()
    
    def delete(self, task_id):
        task = Task.query.get_or_404(task_id)
        
        if task.image_filename:
            storage.delete_file(task.image_filename)
        
        db.session.delete(task)
        db.session.commit()
        
        return {'message': 'Задача успешно удалена'}, 200

class TaskImageUploadResource(Resource):
    def post(self, task_id):
        task = Task.query.get_or_404(task_id)
        
        if 'image' not in request.files:
            return {'error': 'Файл не выбран'}, 400
        
        file = request.files['image']
        
        if file.filename == '':
            return {'error': 'Файл не выбран'}, 400
        
        if '.' in file.filename: # type: ignore
            ext = file.filename.rsplit('.', 1)[1].lower() # type: ignore
            if ext not in storage.get_allowed_extensions(): 
                return {'error': f'Недопустимый тип файла. Разрешенные типы: {storage.get_allowed_extensions()}'}, 400
        
        if task.image_filename:
            storage.delete_file(task.image_filename)
        
        filename = storage.generate_unique_filename(file.filename)
        success = storage.upload_file(file, filename)
        
        if success:
            task.image_filename = filename
            db.session.commit()
            return {'message': 'Файл успешно загружен', 'filename': filename}, 200
        else:
            return {'error': 'Ошибка при загрузке файла'}, 500

class TaskImageUrlResource(Resource):
    def get(self, task_id):
        task = Task.query.get_or_404(task_id)
        
        if not task.image_filename:
            return {'error': 'К этой задаче не прикреплен файл'}, 404
        
        url = storage.generate_presigned_url(task.image_filename)
        
        if url:
            return {'url': url}, 200
        else:
            return {'error': 'Ошибка при генерации URL для скачивания файла'}, 500