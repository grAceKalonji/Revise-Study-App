import React, { useState } from 'react';
import { View, Text, TextInput, Button, Switch, TouchableOpacity, FlatList, StyleSheet, Dimensions, Alert, Modal} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Colours from '../../constants/Colors';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import Slider from '@react-native-community/slider';
import TimePickerModal from '../../components/TimePickerModal'; // Ensure this path is correct
import InfoModal1 from '@/components/infoModals/infoModal1';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Textbook } from '../types';
import UploadScreen from '../UploadScreen'; // Ensure this path is correct

type RootStackParamList = {
  Classes: undefined;
  Profile: undefined;
};

export type Course = {
  title: string;
  startTime: Date;
  endTime: Date;
  frequency: string | string[];
  questionFrequency: number;
  qaPairs: { question: string; answer: string }[];
  textbooks?: Textbook[]; 
};

const { width } = Dimensions.get('window');

const CourseScheduler: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const [title, setTitle] = useState<string>('');
  const [date, setDate] = useState<Date>(new Date());
  const [frequency, setFrequency] = useState<string | string[]>('Daily');
  const [startTime, setStartTime] = useState<Date>(new Date());
  const [endTime, setEndTime] = useState<Date>(new Date());
  const [questionFrequency, setQuestionFrequency] = useState<number>(0);
  const [question, setQuestion] = useState<string>('');
  const [answer, setAnswer] = useState<string>('');
  const [qaPairs, setQaPairs] = useState<{ question: string; answer: string }[]>([]);
  const [pickerMode, setPickerMode] = useState<'start' | 'end' | null>(null);
  const [textbooks, setTextbooks] = useState<Textbook[]>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedTime, setSelectedTime] = useState<Date>(new Date()); // State for selected time

  const onDateChange = (_event: any, selectedDate?: Date) => {
    if (pickerMode === 'start' && selectedDate) {
      setStartTime(selectedDate);
    } else if (pickerMode === 'end' && selectedDate) {
      setEndTime(selectedDate);
    }
    setPickerMode(null);
  };


  const handleTextbookUpload = () => {
    const newTextbook: Textbook = {
      id: Math.random().toString(),
      name: 'Sample Textbook',
      uri: 'sample-uri',
      extractedText: 'Sample extracted text',
      uploadedAt: new Date(),
    };

    setTextbooks(prev => [...prev, newTextbook]);
  };

  const handleSubmit = async () => {
    if (textbooks.length === 0) {
      Alert.alert('Error', 'Please upload at least one textbook');
      return;
    }

    const newCourse: Course = {
      title,
      startTime,
      endTime,
      frequency,
      questionFrequency,
      qaPairs,
      textbooks,
    };
    
  };

  const openTimePicker = (mode: 'start' | 'end') => {
    setPickerMode(mode);
    setSelectedTime(mode === 'start' ? startTime : endTime);
    setModalVisible(true);
  };

  const confirmTime = () => {
    if (pickerMode === 'start') {
      setStartTime(selectedTime);
    } else if (pickerMode === 'end') {
      setEndTime(selectedTime);
    }
    setModalVisible(false);
  };

  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [infoModal2Visible, setInfoModal2Visible] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.frame}>
        
        <Text style={styles.title}>Course Title:</Text>
        <TextInput 
          value={title} 
          onChangeText={setTitle}  
          placeholder="Enter course title" 
          placeholderTextColor="gray" 
          style={{ height: 50 }}
        />
        
        <View style= {{ flexDirection: 'row', alignItems: 'center'}}>
        <Text style={styles.title}>Start Time:</Text> 
        <TouchableOpacity 
          onPress={() => setInfoModalVisible(true)}
          style={styles.iconContainer}
        >
          <FontAwesome 
            name="question-circle" 
            size={20} 
            color={Colours.secondary} 
          />
        </TouchableOpacity>
        </View>
        
        <InfoModal1
        modalVisible={infoModalVisible}
         setModalVisible={setInfoModalVisible}
         title="Start time"
        quote= "let us know what time you would typically like to be asked questions"
        />

        <TouchableOpacity onPress={() => openTimePicker('start')} 
          style={{ height: 50 }}>
          <Text>{startTime.toLocaleTimeString()}</Text>
        </TouchableOpacity>
        

        <View style= {{ flexDirection: 'row', alignItems: 'center'}}>
        <Text style={styles.title}>End Time:</Text>
        <TouchableOpacity 
          onPress={() => setInfoModal2Visible(true)}
          style={styles.iconContainer}
        >
          <FontAwesome 
            name="question-circle" 
            size={20} 
            color={Colours.secondary} 
          />
        </TouchableOpacity>
        </View>

        <InfoModal1
        modalVisible={infoModal2Visible}
         setModalVisible={setInfoModal2Visible}
         title="End Time"
        quote= "let us know what time you would typically like for us to stop asking you Questions"
        />

        <TouchableOpacity onPress={() => openTimePicker('end')}
          style={{ height: 50 }}>
          <Text>{endTime.toLocaleTimeString()}</Text>
        </TouchableOpacity>

        
        <Text style={styles.title}>How often should we ask you questions:</Text>
        <TextInput value={String(questionFrequency)} onChangeText={text => setQuestionFrequency(Number(text))} keyboardType="numeric" placeholder="In minutes" />
        
        <Button 
    title="Upload Textbook" 
    onPress={() => setShowUploadModal(true)}
  />
        
        <Button title="Submit" onPress={handleSubmit} />

        <Modal
    visible={showUploadModal}
    animationType="slide"
    onRequestClose={() => setShowUploadModal(false)}
  >
    <UploadScreen 
      onTextbookUpload={(newTextbook) => {
        setTextbooks(prev => [...prev, newTextbook]);
        setShowUploadModal(false);
      }} 
    />
    <TouchableOpacity
      style={styles.doneButton}
      onPress={() => setShowUploadModal(false)}
    >
      <Text style={styles.doneButtonText}>Done</Text>
    </TouchableOpacity>
  </Modal>
      
      </View>

      {/* Use the reusable TimePickerModal component */}
      <TimePickerModal
        modalVisible={modalVisible}
        selectedTime={selectedTime}
        setSelectedTime={setSelectedTime}
        confirmTime={confirmTime}
        setModalVisible={setModalVisible}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  frame: {
    width: width - 40,
    backgroundColor: Colours.primary,
    justifyContent: 'center',
    padding: 20,
    borderRadius: 20,
    borderWidth: 0,
    elevation: 5,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.25, 
    shadowRadius: 3.84, 
  },

  iconContainer: {
    marginLeft: 8,
    padding: 20,
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

  helpContainer: {
    marginTop: 15,
    marginHorizontal: 20,
    alignItems: 'center',
  },
  
  modalView: {
    margin: 20,
    backgroundColor: 'gray',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 5,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  doneButton: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    backgroundColor: Colours.secondary,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    elevation: 3,
  },
  doneButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default CourseScheduler;
