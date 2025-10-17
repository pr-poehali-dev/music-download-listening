import json
import os
import base64
import uuid
from typing import Dict, Any, List
import psycopg2

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: API для управления музыкальными треками - получение списка, загрузка, удаление
    Args: event с httpMethod, body, queryStringParameters
          context с request_id
    Returns: HTTP response с JSON данными
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    database_url = os.environ.get('DATABASE_URL')
    
    try:
        conn = psycopg2.connect(database_url)
        cur = conn.cursor()
        try:
                
                if method == 'GET':
                    params = event.get('queryStringParameters') or {}
                    genre_filter = params.get('genre', 'all')
                    search_query = params.get('search', '')
                    
                    query = 'SELECT id, title, artist, genre, duration, audio_url, cover_url, plays, likes, uploaded_at FROM tracks WHERE 1=1'
                    
                    if genre_filter != 'all':
                        query += f" AND genre = '{genre_filter}'"
                    
                    if search_query:
                        search_lower = search_query.lower().replace("'", "''")
                        query += f" AND (LOWER(title) LIKE '%{search_lower}%' OR LOWER(artist) LIKE '%{search_lower}%')"
                    
                    query += ' ORDER BY uploaded_at DESC LIMIT 100'
                    
                    cur.execute(query)
                    rows = cur.fetchall()
                    
                    tracks = []
                    for row in rows:
                        tracks.append({
                            'id': row[0],
                            'title': row[1],
                            'artist': row[2],
                            'genre': row[3],
                            'duration': row[4],
                            'audioUrl': row[5],
                            'coverUrl': row[6] or 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400',
                            'plays': row[7],
                            'likes': row[8],
                            'uploadedAt': row[9].isoformat() if row[9] else None
                        })
                    
                    return {
                        'statusCode': 200,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'body': json.dumps({'tracks': tracks}),
                        'isBase64Encoded': False
                    }
                
                elif method == 'POST':
                    body_data = json.loads(event.get('body', '{}'))
                    
                    title = body_data.get('title', '').strip()
                    artist = body_data.get('artist', '').strip()
                    genre = body_data.get('genre', '').strip()
                    duration = body_data.get('duration', '0:00')
                    audio_url = body_data.get('audioUrl', '').strip()
                    cover_url = body_data.get('coverUrl', '').strip()
                    
                    if not title or not artist or not genre or not audio_url:
                        return {
                            'statusCode': 400,
                            'headers': {
                                'Content-Type': 'application/json',
                                'Access-Control-Allow-Origin': '*'
                            },
                            'body': json.dumps({'error': 'Заполните все обязательные поля'}),
                            'isBase64Encoded': False
                        }
                    
                    title_esc = title.replace("'", "''")
                    artist_esc = artist.replace("'", "''")
                    genre_esc = genre.replace("'", "''")
                    duration_esc = duration.replace("'", "''")
                    audio_url_esc = audio_url.replace("'", "''")
                    cover_url_esc = cover_url.replace("'", "''") if cover_url else ''
                    
                    insert_query = f"""
                        INSERT INTO tracks (title, artist, genre, duration, audio_url, cover_url)
                        VALUES ('{title_esc}', '{artist_esc}', '{genre_esc}', '{duration_esc}', '{audio_url_esc}', 
                                {f"'{cover_url_esc}'" if cover_url_esc else 'NULL'})
                        RETURNING id, title, artist, genre, duration, audio_url, cover_url, plays, likes, uploaded_at
                    """
                    
                    cur.execute(insert_query)
                    conn.commit()
                    
                    row = cur.fetchone()
                    
                    new_track = {
                        'id': row[0],
                        'title': row[1],
                        'artist': row[2],
                        'genre': row[3],
                        'duration': row[4],
                        'audioUrl': row[5],
                        'coverUrl': row[6] or 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400',
                        'plays': row[7],
                        'likes': row[8],
                        'uploadedAt': row[9].isoformat() if row[9] else None
                    }
                    
                    return {
                        'statusCode': 201,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'body': json.dumps({'track': new_track, 'message': 'Трек успешно загружен'}),
                        'isBase64Encoded': False
                    }
                
                elif method == 'DELETE':
                    params = event.get('queryStringParameters') or {}
                    track_id = params.get('id')
                    
                    if not track_id:
                        return {
                            'statusCode': 400,
                            'headers': {
                                'Content-Type': 'application/json',
                                'Access-Control-Allow-Origin': '*'
                            },
                            'body': json.dumps({'error': 'ID трека не указан'}),
                            'isBase64Encoded': False
                        }
                    
                    delete_query = f"DELETE FROM tracks WHERE id = {int(track_id)}"
                    cur.execute(delete_query)
                    conn.commit()
                    
                    return {
                        'statusCode': 200,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'body': json.dumps({'message': 'Трек удален'}),
                        'isBase64Encoded': False
                    }
                
                return {
                    'statusCode': 405,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'Method not allowed'}),
                    'isBase64Encoded': False
                }
        finally:
            cur.close()
            conn.close()
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }