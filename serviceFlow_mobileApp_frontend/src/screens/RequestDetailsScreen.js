import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { fetchRequestDetails, acceptRequest } from '../services/api';

export default function RequestDetailsScreen({ route, navigation }) {
    const { id } = route.params;
    const [request, setRequest] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await fetchRequestDetails(id);
            setRequest(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [id]);

    const handleAccept = async () => {
        try {
            await acceptRequest(id);
            Alert.alert('Success', 'Request Accepted');
            loadData();
        } catch (e) {
            Alert.alert('Error', e.response?.data?.message || 'Failed to accept');
        }
    };

    if (loading || !request) return <View style={styles.centered}><ActivityIndicator size="large" /></View>;

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Service Request #{request.id}</Text>
            <View style={styles.card}>
                <Text><Text style={styles.bold}>Customer:</Text> {request.customerName}</Text>
                <Text><Text style={styles.bold}>Contact:</Text> {request.contactNumber}</Text>
                <Text><Text style={styles.bold}>Address:</Text> {request.address}</Text>
                <Text><Text style={styles.bold}>Priority:</Text> {request.priority}</Text>
                <Text><Text style={styles.bold}>Status:</Text> {request.status}</Text>
                <Text><Text style={styles.bold}>Issue:</Text> {request.issueDescription}</Text>
            </View>

            <View style={styles.actions}>
                {request.status === 'ASSIGNED' && (
                    <Button title="Accept Request" onPress={handleAccept} />
                )}
                {request.status !== 'REQUEST_RAISED' && request.status !== 'ASSIGNED' && request.status !== 'CLOSED' && (
                    <Button title="Update Status" onPress={() => navigation.navigate('UpdateStatus', { id: request.id, currentStatus: request.status })} />
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 15 },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
    card: { backgroundColor: 'white', padding: 15, borderRadius: 5, elevation: 2, marginBottom: 20 },
    bold: { fontWeight: 'bold' },
    actions: { marginTop: 10 }
});
