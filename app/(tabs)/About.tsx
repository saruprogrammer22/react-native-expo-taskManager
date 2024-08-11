import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, FontAwesome, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';

const TabHome: React.FC = () => {

    return (
        <View style={styles.container}>
            <View style={styles.contentContainer}>
                <Text style={styles.title}>Technologies</Text>
                <View style={styles.technologiesContainer}>
                    {/* React Native */}
                    <LinearGradient colors={['#61DAFB', '#61DAFB']} style={styles.technologyItemContainer}>
                        <Ionicons name="logo-react" size={20} color="white" style={styles.technologyIcon} />
                        <Text style={styles.technologyItemText}>React Native</Text>
                    </LinearGradient>
                    {/* Zustand */}
                    <LinearGradient colors={['#5E49E3', '#5E49E3']} style={styles.technologyItemContainer}>
                        <FontAwesome5 name="code" size={20} color="white" style={styles.technologyIcon} />
                        <Text style={styles.technologyItemText}>Zustand</Text>
                    </LinearGradient>
                    {/* Node JS */}
                    <LinearGradient colors={['#3C873A', '#3C873A']} style={styles.technologyItemContainer}>
                        <FontAwesome name="server" size={20} color="white" style={styles.technologyIcon} />
                        <Text style={styles.technologyItemText}>Node JS</Text>
                    </LinearGradient>
                    {/* MySQL */}
                    <LinearGradient colors={['#4479A1', '#4479A1']} style={styles.technologyItemContainer}>
                        <MaterialCommunityIcons name="database" size={20} color="white" style={styles.technologyIcon} />
                        <Text style={styles.technologyItemText}>MySQL</Text>
                    </LinearGradient>
                    {/* Tanstack Query */}
                    <LinearGradient colors={['#F15B2A', '#F15B2A']} style={styles.technologyItemContainer}>
                        <FontAwesome5 name="code" size={20} color="white" style={styles.technologyIcon} />
                        <Text style={styles.technologyItemText}>Tanstack Query</Text>
                    </LinearGradient>
                    {/* Zod (using a checklist icon to represent forms and validation) */}
                    <LinearGradient colors={['#7C53F8', '#7C53F8']} style={styles.technologyItemContainer}>
                        <FontAwesome5 name="check-double" size={20} color="white" style={styles.technologyIcon} />
                        <Text style={styles.technologyItemText}>Zod</Text>
                    </LinearGradient>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f9f9f9',
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    technologiesContainer: {
        alignItems: 'center',
    },
    technologyItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        padding: 15,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    technologyIcon: {
        marginRight: 10,
    },
    technologyItemText: {
        fontSize: 18,
        fontWeight: '600',
        color: 'white',
    },
});

export default TabHome;