import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';

const ChatModal = ({ isVisible, onClose, busId, db, senderId, theme }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    if (!busId) return;
    const q = query(collection(db, 'active_buses', busId, 'messages'), orderBy('timestamp', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [busId]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === '' || !busId) return;
    await addDoc(collection(db, 'active_buses', busId, 'messages'), {
      text: newMessage,
      senderId,
      timestamp: serverTimestamp(),
    });
    setNewMessage('');
  };

  const styles = getChatStyles(theme);

  return (
    <Modal animationType="slide" transparent={true} visible={isVisible} onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.chatTitle}>Bus Chat</Text>
          <FlatList
            data={messages}
            inverted
            renderItem={({ item }) => (
              <View style={[styles.messageBubble, item.senderId === senderId ? styles.myMessage : styles.theirMessage]}>
                <Text style={item.senderId === senderId ? styles.myMessageText : styles.theirMessageText}>{item.text}</Text>
                <Text style={[styles.timestamp, item.senderId === senderId ? styles.myTimestamp : styles.theirTimestamp]}>{item.timestamp?.toDate().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</Text>
              </View>
            )}
            keyExtractor={item => item.id}
            style={styles.messageList}
          />
          <View style={styles.inputContainer}>
            <TextInput style={styles.input} value={newMessage} onChangeText={setNewMessage} placeholder="Type a message..." placeholderTextColor={theme.placeholder} />
            <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}><Text style={styles.sendButtonText}>Send</Text></TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}><Text style={styles.closeButtonText}>Close</Text></TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const getChatStyles = (theme) => StyleSheet.create({
    modalContainer: { flex: 1, justifyContent: 'flex-end' },
    modalContent: { backgroundColor: theme.surface, height: '85%', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 },
    chatTitle: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 15, color: theme.primary },
    messageList: { flex: 1 },
    messageBubble: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20, marginBottom: 10, maxWidth: '80%' },
    myMessage: { backgroundColor: theme.primary, alignSelf: 'flex-end' },
    theirMessage: { backgroundColor: theme.mode === 'light' ? '#E5E5EA' : '#373737', alignSelf: 'flex-start' },
    myMessageText: { color: theme.mode === 'light' ? theme.white : theme.text, fontSize: 16 },
    theirMessageText: { color: theme.text, fontSize: 16 },
    timestamp: { fontSize: 10, alignSelf: 'flex-end', marginTop: 4, marginLeft: 5 },
    myTimestamp: { color: 'rgba(255,255,255,0.7)' },
    theirTimestamp: { color: theme.placeholder },
    inputContainer: { flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, borderTopColor: theme.background, paddingTop: 10 },
    input: { flex: 1, height: 40, backgroundColor: theme.background, color: theme.text, borderRadius: 20, paddingHorizontal: 15 },
    sendButton: { marginLeft: 10, padding: 10 },
    sendButtonText: { color: theme.primary, fontWeight: 'bold' },
    closeButton: { marginTop: 10, alignItems: 'center' },
    closeButtonText: { color: theme.danger, fontSize: 16 },
});

export default ChatModal;