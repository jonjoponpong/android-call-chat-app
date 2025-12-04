import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor
import uuid

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Регистрация и авторизация пользователей по имени пользователя
    Args: event - содержит httpMethod и данные пользователя в body
          context - контекст выполнения функции
    Returns: JSON с информацией о пользователе и токеном
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
    username = body_data.get('username')
    full_name = body_data.get('full_name', username)
    
    if not username:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Username is required'}),
            'isBase64Encoded': False
        }
    
    database_url = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(database_url)
    
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute(
                "SELECT id, username, full_name, email, phone, bio, avatar_url, status, last_seen, unique_id "
                "FROM t_p36259787_android_call_chat_ap.users WHERE username = %s",
                (username,)
            )
            existing_user = cur.fetchone()
            
            if existing_user:
                cur.execute(
                    "UPDATE t_p36259787_android_call_chat_ap.users "
                    "SET status = 'online', last_seen = CURRENT_TIMESTAMP "
                    "WHERE id = %s",
                    (existing_user['id'],)
                )
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({
                        'id': existing_user['id'],
                        'username': existing_user['username'],
                        'full_name': existing_user['full_name'],
                        'email': existing_user['email'],
                        'phone': existing_user['phone'],
                        'bio': existing_user['bio'],
                        'avatar_url': existing_user['avatar_url'],
                        'status': 'online',
                        'unique_id': existing_user['unique_id'],
                        'is_new': False
                    }),
                    'isBase64Encoded': False
                }
            
            unique_id = str(uuid.uuid4())
            email = body_data.get('email', f'{username}@temp.com')
            
            cur.execute(
                "INSERT INTO t_p36259787_android_call_chat_ap.users "
                "(username, full_name, email, unique_id, status) "
                "VALUES (%s, %s, %s, %s, 'online') "
                "RETURNING id, username, full_name, email, phone, bio, avatar_url, status, unique_id",
                (username, full_name, email, unique_id)
            )
            new_user = cur.fetchone()
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'id': new_user['id'],
                    'username': new_user['username'],
                    'full_name': new_user['full_name'],
                    'email': new_user['email'],
                    'phone': new_user['phone'],
                    'bio': new_user['bio'],
                    'avatar_url': new_user['avatar_url'],
                    'status': new_user['status'],
                    'unique_id': new_user['unique_id'],
                    'is_new': True
                }),
                'isBase64Encoded': False
            }
    finally:
        conn.close()
