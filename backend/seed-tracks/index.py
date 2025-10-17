import json
import os
from typing import Dict, Any
import psycopg2

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Заполнение базы данных начальными треками известных исполнителей
    Args: event с httpMethod
          context с request_id
    Returns: HTTP response с результатом
    '''
    method: str = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
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
            'body': json.dumps({'error': 'Only POST method allowed'}),
            'isBase64Encoded': False
        }
    
    database_url = os.environ.get('DATABASE_URL')
    
    tracks_data = [
        ('Midnight City', 'M83', 'Synthwave', '4:04', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', 'https://images.unsplash.com/photo-1614149162883-504ce4d13909?w=400', 245000, 18500),
        ('Genesis', 'Justice', 'Electronic', '3:48', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=400', 198000, 14200),
        ('Strobe', 'Deadmau5', 'Progressive House', '10:37', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400', 420000, 32000),
        ('Scary Monsters', 'Skrillex', 'Dubstep', '4:03', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400', 567000, 41000),
        ('Language', 'Porter Robinson', 'Electronic', '4:43', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3', 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400', 312000, 25800),
        ('Animals', 'Martin Garrix', 'Big Room House', '5:02', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3', 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=400', 892000, 67000),
        ('Levels', 'Avicii', 'Progressive House', '3:19', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3', 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400', 1245000, 95000),
        ('Titanium', 'David Guetta', 'Electro House', '4:05', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400', 678000, 52000),
        ('One More Time', 'Daft Punk', 'House', '5:20', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3', 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400', 1560000, 120000),
        ('Faded', 'Alan Walker', 'Progressive House', '3:32', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3', 'https://images.unsplash.com/photo-1445985543470-41fba5c3144a?w=400', 987000, 78000),
        ('Clarity', 'Zedd', 'Electro House', '4:31', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3', 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=400', 534000, 42000),
        ('Wake Me Up', 'Avicii', 'Progressive House', '4:09', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3', 'https://images.unsplash.com/photo-1518972734183-c0ea79a3eee1?w=400', 1123000, 89000),
        ('Lean On', 'Major Lazer', 'Electronic', '2:56', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3', 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=400', 2340000, 180000),
        ('Don''t You Worry Child', 'Swedish House Mafia', 'Progressive House', '3:32', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400', 876000, 65000),
        ('Summertime Sadness', 'Lana Del Rey', 'Indie Electronic', '4:25', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3', 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400', 654000, 51000)
    ]
    
    try:
        conn = psycopg2.connect(database_url)
        cur = conn.cursor()
        
        try:
            cur.execute('DELETE FROM tracks')
            
            for track in tracks_data:
                insert_query = """
                    INSERT INTO tracks (title, artist, genre, duration, audio_url, cover_url, plays, likes)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                """
                cur.execute(insert_query, track)
            
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'message': f'Successfully added {len(tracks_data)} tracks',
                    'count': len(tracks_data)
                }),
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
