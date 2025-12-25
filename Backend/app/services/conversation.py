from datetime import datetime, timedelta

class ConversationManager:
    def __init__(self, ttl_minutes=30):
        self.conversations = {}
        self.ttl = timedelta(minutes=ttl_minutes)
    
    def get_conversation(self, session_id: str):
        if session_id in self.conversations:
            conv_data = self.conversations[session_id]
            if datetime.now() - conv_data['last_activity'] < self.ttl:
                return conv_data
            else:
                del self.conversations[session_id]
        return None
    
    def start_conversation(self, session_id: str):
        self.conversations[session_id] = {
            'history': [],
            'last_activity': datetime.now(),
            'sources': []
        }
    
    def add_message(self, session_id: str, role: str, content: str, sources=None):
        if session_id not in self.conversations:
            self.start_conversation(session_id)
        
        self.conversations[session_id]['history'].append({
            'role': role,
            'content': content,
            'timestamp': datetime.now()
        })
        
        if sources:
            self.conversations[session_id]['sources'].extend(sources)
        
        self.conversations[session_id]['last_activity'] = datetime.now()

conversation_manager = ConversationManager()