import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { Course } from './AddClass'; // This should now work

type ClassesScreenProps = {
  route: {
    params: {
      newCourse: Course;
    };
  };
};

const ClassesScreen: React.FC<ClassesScreenProps> = ({ route }) => {
  console.log(route); // Debugging line
  const { newCourse } = route.params; // Get the new course from navigation params

  return (
    <View>
      <Text>Classes:</Text>
      <FlatList
        data={[newCourse]} // Assuming you want to display the newly added course
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <View>
            <Text>{item.title}</Text>
            {/* <Text>{item.isEnabled ? 'Enabled' : 'Disabled'}</Text> */}
            <Text>{item.textbooks}</Text> {/* Display textbook info */}
          </View>
        )}
      />
    </View>
  );
};

export default ClassesScreen; 

