import React from 'react';
import { StyleSheet, Text, View, FlatList, Dimensions, TouchableOpacity, Animated } from 'react-native';
import { Ionicons, FontAwesome, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';

// Technologies i use
import { technologies } from '../config/Technologies';



const TechnologyItem: React.FC<{
    name: string;
    icon: string;
    type: string;
    color: string;
    bgColor: string;
}> = ({ name, icon, type, color, bgColor }) => {
    const IconComponent = type === 'Ionicons' ? Ionicons :
        type === 'FontAwesome' ? FontAwesome :
            type === 'FontAwesome5' ? FontAwesome5 :
                MaterialCommunityIcons;

    const animatedValue = new Animated.Value(1);

    const onPressIn = () => {
        Animated.spring(animatedValue, {
            toValue: 0.95,
            useNativeDriver: true,
        }).start();
    };

    const onPressOut = () => {
        Animated.spring(animatedValue, {
            toValue: 1,
            useNativeDriver: true,
        }).start();
    };

    return (
        <TouchableOpacity
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            activeOpacity={0.7}
        >
            <Animated.View style={[
                styles.technologyItemContainer,
                { backgroundColor: bgColor, transform: [{ scale: animatedValue }] }
            ]}>
                <IconComponent name={icon as any} size={32} color={color} style={styles.technologyIcon} />
                <Text style={[styles.technologyItemText, { color }]}>{name}</Text>
            </Animated.View>
        </TouchableOpacity>
    );
};

const TabHome: React.FC = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Tech Stack</Text>
            <FlatList
                data={technologies}
                renderItem={({ item }) => <TechnologyItem {...item} />}
                keyExtractor={(item) => item.name}
                numColumns={2}
                columnWrapperStyle={styles.columnWrapper}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

const { width } = Dimensions.get('window');
const itemWidth = (width - 48) / 2;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        paddingTop: 60,
        paddingHorizontal: 16,
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: '#333333',
        marginBottom: 24,
        textAlign: 'left',
    },
    columnWrapper: {
        justifyContent: 'space-between',
    },
    technologyItemContainer: {
        width: itemWidth,
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    technologyIcon: {
        marginBottom: 12,
    },
    technologyItemText: {
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
});

export default TabHome;