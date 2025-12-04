import json
import base64
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Скачивает файл из базы данных по его ID
    Args: event - содержит httpMethod и file_id в queryStringParameters
          context - контекст выполнения функции
    Returns: Файл в формате base64 или информацию о файле
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    params = event.get('queryStringParameters', {})
    file_id = params.get('file_id')
    message_id = params.get('message_id')
    
    if not file_id and not message_id:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'file_id or message_id required'}),
            'isBase64Encoded': False
        }
    
    database_url = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(database_url)
    
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            if file_id:
                cur.execute(
                    "SELECT id, message_id, file_name, file_type, file_size, file_data, uploaded_by, created_at "
                    "FROM t_p36259787_android_call_chat_ap.files WHERE id = %s",
                    (file_id,)
                )
                file_record = cur.fetchone()
            else:
                cur.execute(
                    "SELECT id, message_id, file_name, file_type, file_size, file_data, uploaded_by, created_at "
                    "FROM t_p36259787_android_call_chat_ap.files WHERE message_id = %s",
                    (message_id,)
                )
                file_record = cur.fetchone()
            
            if not file_record:
                return {
                    'statusCode': 404,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'File not found'}),
                    'isBase64Encoded': False
                }
            
            file_data_base64 = base64.b64encode(bytes(file_record['file_data'])).decode('utf-8')
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'id': file_record['id'],
                    'message_id': file_record['message_id'],
                    'file_name': file_record['file_name'],
                    'file_type': file_record['file_type'],
                    'file_size': file_record['file_size'],
                    'file_data': file_data_base64,
                    'uploaded_by': file_record['uploaded_by'],
                    'created_at': file_record['created_at'].isoformat()
                }),
                'isBase64Encoded': False
            }
    finally:
        conn.close()
