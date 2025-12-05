import boto3
from botocore.exceptions import ClientError
import uuid
from flask import current_app

class YandexS3Storage:
    def __init__(self):
        self.s3_client = None
        self.bucket_name = None
    
    def _ensure_client(self):
        if self.s3_client is None:
            self.s3_client = boto3.client(
                's3',
                endpoint_url=current_app.config['YC_S3_ENDPOINT'],
                aws_access_key_id=current_app.config['YC_S3_ACCESS_KEY'],
                aws_secret_access_key=current_app.config['YC_S3_SECRET_KEY']
            )
            self.bucket_name = current_app.config['YC_S3_BUCKET']
    
    def upload_file(self, file, filename):
        self._ensure_client()
        try:
            self.s3_client.upload_fileobj( # type: ignore
                file,
                self.bucket_name,
                filename,
                ExtraArgs={'ContentType': file.content_type}
            )
            return filename
        except ClientError as e:
            current_app.logger.error(f"Ошибка загрузки файла в хранилище: {e}")
            return None
    
    def delete_file(self, filename):
        if not filename:
            return True
        
        self._ensure_client()
        try:
            self.s3_client.delete_object( # type: ignore
                Bucket=self.bucket_name,
                Key=filename
            )
            return True
        except ClientError as e:
            current_app.logger.error(f"Ошибка удаления файла из хранилища: {e}")
            return False
    
    def generate_presigned_url(self, filename, expiration=3600):
        if not filename:
            return None
        
        self._ensure_client()
        try:
            url = self.s3_client.generate_presigned_url( # type: ignore
                'get_object',
                Params={
                    'Bucket': self.bucket_name,
                    'Key': filename
                },
                ExpiresIn=expiration
            )
            return url
        except ClientError as e:
            current_app.logger.error(f"Ошибка генерации URL для скачивания файла: {e}")
            return None
    
    def get_allowed_extensions(self):
        return current_app.config['ALLOWED_EXTENSIONS']
    
    def generate_unique_filename(self, original_filename):
        ext = original_filename.rsplit('.', 1)[1].lower() if '.' in original_filename else ''
        unique_id = str(uuid.uuid4())
        return f"{unique_id}.{ext}" if ext else unique_id

storage = YandexS3Storage()