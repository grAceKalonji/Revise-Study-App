import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, Dimensions, Modal } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';

const { width } = Dimensions.get('window');

export default function ModalScreen() {
  const [modalVisible, setModalVisible] = useState<boolean>(true);

  return (
    <Modal
    animationType="slide"
    transparent={true}
    visible={modalVisible}
    onRequestClose={() => setModalVisible(false)}>
    <View style={styles.container}>
      <Text>Dance for your beans</Text>
    </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    width: width - 40,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
