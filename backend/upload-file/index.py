import json
import base64
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Загружает файл в базу данных и связывает его с сообщением в чате
    Args: event - содержит httpMethod, body с файлом в base64, message_id и user_id
          context - контекст выполнения функции
    Returns: JSON с информацией о загруженном файле
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    body_data = json.loads(event.get('body', '{}'))
    message_id = body_data.get('message_id')
    user_id = body_data.get('user_id')
    file_name = body_data.get('file_name')
    file_type = body_data.get('file_type')
    file_data_base64 = body_data.get('file_data')
    
    if not all([message_id, user_id, file_name, file_type, file_data_base64]):
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Missing required fields'}),
            'isBase64Encoded': False
        }
    
    file_data = base64.b64decode(file_data_base64)
    file_size = len(file_data)
    
    database_url = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(database_url)
    
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute(
                "INSERT INTO t_p36259787_android_call_chat_ap.files "
                "(message_id, file_name, file_type, file_size, file_data, uploaded_by) "
                "VALUES (%s, %s, %s, %s, %s, %s) RETURNING id, created_at",
                (message_id, file_name, file_type, file_size, psycopg2.Binary(file_data), user_id)
            )
            result = cur.fetchone()
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'id': result['id'],
                    'file_name': file_name,
                    'file_type': file_type,
                    'file_size': file_size,
                    'created_at': result['created_at'].isoformat()
                }),
                'isBase64Encoded': False
            }
    finally:
        conn.close()
