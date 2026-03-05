import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { updateRequestStatusApi } from '../services/api';

export default function UpdateStatusScreen({ route, navigation }) {
    const { id, currentStatus } = route.params;
    const [remarks, setRemarks] = useState('');
    const [loading, setLoading] = useState(false);

    const getNextStatusOptions = (status) => {
        switch (status) {
            case 'ACCEPTED': return ['ON_THE_WAY'];
            case 'ON_THE_WAY': return ['IN_PROGRESS'];
            case 'IN_PROGRESS': return ['RESOLVED'];
            case 'RESOLVED': return ['CUSTOMER_CONFIRMED', 'IN_PROGRESS'];
            case 'CUSTOMER_CONFIRMED': return ['CLOSED'];
            default: return [];
        }
    };

    const nextOptions = getNextStatusOptions(currentStatus);

    const handleUpdate = async (newStatus) => {
        setLoading(true);
        try {
            await updateRequestStatusApi(id, newStatus, remarks);
            Alert.alert('Success', 'Status Updated');
            navigation.goBack();
        } catch (e) {
            Alert.alert('Error', e.response?.data?.message || 'Update failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Update Status</Text>
            <Text style={styles.subtitle}>Current: {currentStatus}</Text>

            <TextInput
                style={styles.input}
                placeholder="Enter remarks (optional)"
                value={remarks}
                onChangeText={setRemarks}
                multiline
            />

            {loading ? <ActivityIndicator size="large" /> : (
                <View style={styles.btnContainer}>
                    {nextOptions.map(status => (
                        <View key={status} style={styles.btnWrapper}>
                            <Button title={`Change to ${status}`} onPress={() => handleUpdate(status)} />
                        </View>
                    ))}
                    {nextOptions.length === 0 && <Text>No further actions available.</Text>}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
    subtitle: { fontSize: 16, marginBottom: 20, color: 'gray' },
    input: { borderColor: 'gray', borderWidth: 1, padding: 10, height: 100, textAlignVertical: 'top', marginBottom: 20, borderRadius: 5 },
    btnContainer: { gap: 10 },
    btnWrapper: { marginBottom: 10 }
});
