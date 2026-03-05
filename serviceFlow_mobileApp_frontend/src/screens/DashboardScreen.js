import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { fetchDashboardRequests } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function DashboardScreen({ navigation }) {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const { logout } = useAuth();

    useEffect(() => {
        const loadRequests = async () => {
            try {
                const data = await fetchDashboardRequests();
                setRequests(data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };

        const unsubscribe = navigation.addListener('focus', () => {
            loadRequests();
        });

        loadRequests();
        return unsubscribe;
    }, [navigation]);

    if (loading) return <View style={styles.centered}><ActivityIndicator size="large" /></View>;

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={logout} style={styles.logoutBtn}><Text style={styles.logoutText}>Logout</Text></TouchableOpacity>
            <FlatList
                data={requests}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('RequestDetails', { id: item.id })}>
                        <Text style={styles.cardTitle}>#{item.id} - {item.customerName}</Text>
                        <Text>Status: {item.status}</Text>
                        <Text>Priority: {item.priority}</Text>
                        <Text>Issue: {item.issueDescription}</Text>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={<Text style={styles.empty}>No requests assigned.</Text>}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 10, backgroundColor: '#f5f5f5' },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    card: { backgroundColor: 'white', padding: 15, marginVertical: 8, borderRadius: 5, elevation: 2 },
    cardTitle: { fontSize: 16, fontWeight: 'bold' },
    empty: { textAlign: 'center', marginTop: 20 },
    logoutBtn: { alignSelf: 'flex-end', padding: 10 },
    logoutText: { color: 'red', fontWeight: 'bold' }
});
