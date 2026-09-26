from langgraph.checkpoint.memory import MemorySaver
# from langgraph.checkpoint.postgres import PostgresSaver
# import psycopg2
# from config import DATABASE_URL

# For hackathon quick start, we use MemorySaver. 
# Member 2 (Backend) will swap this out for PostgresSaver once Supabase is setup.
# 
# def get_checkpointer():
#     conn = psycopg2.connect(DATABASE_URL)
#     return PostgresSaver(conn)

_memory_saver = MemorySaver()

def get_checkpointer():
    return _memory_saver
