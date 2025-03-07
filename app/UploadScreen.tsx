import React, { useState } from 'react';
import { View, Button, Alert, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { FontAwesome } from '@expo/vector-icons';
import { Textbook } from './types'; 
import PdfThumbnail from 'react-native-pdf-thumbnail';

// Define the VisionApiResponse type
interface VisionApiResponse {
  responses: {
    fullTextAnnotation?: {
      text: string;
    };
  }[];
}

interface PdfPage {
  uri: string;
}

// Define the props for the UploadScreen component
interface UploadScreenProps {
  onTextbookUpload: (textbook: Textbook) => void;
}

const convertPdfToImages = async (pdfUri: string): Promise<string[]> => {
  try {
    const thumbnail = await PdfThumbnail.generate(pdfUri, 1); // Generate first-page thumbnail
    return [thumbnail.uri]; // Wrap it in an array
  } catch (error) {
    console.error('Error converting PDF to images:', error);
    return [];
  }
};

const extractTextFromImage = async (imageUri: string): Promise<string> => {
  try {
    const base64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const apiKey = 'AIzaSyBhyKMed-6vgZ5KTqAZLe89qcdXveGwyXE';
    const response = await fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requests: [
            {
              image: { content: base64 },
              features: [{ type: 'DOCUMENT_TEXT_DETECTION' }],
            },
          ],
        }),
      }
    );

    const result: VisionApiResponse = await response.json();
    return result.responses?.[0]?.fullTextAnnotation?.text || '';
  } catch (error) {
    console.error('Error extracting text:', error);
    return '';
  }
};

const UploadScreen: React.FC<UploadScreenProps> = ({ onTextbookUpload }) => {
  const [textbooks, setTextbooks] = useState<Textbook[]>([]);

  const handleUpload = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({ type: 'application/pdf' });

      if (!res.canceled && res.assets[0]) {
        const asset = res.assets[0];
        const images = await convertPdfToImages(asset.uri);

        if (images.length === 0) {
          throw new Error('Failed to convert PDF to images.');
        }

        // Extract text from each image page
        let extractedText = '';
        for (const image of images) {
          const text = await extractTextFromImage(image);
          extractedText += text + '\n\n'; // Add spacing between pages
        }

        if (!extractedText.trim()) {
          throw new Error('Failed to extract text. Ensure clear text in PDF.');
        }

        const newTextbook: Textbook = {
          id: Math.random().toString(),
          name: asset.name || 'Unnamed Document',
          uri: asset.uri,
          extractedText,
          uploadedAt: new Date(),
        };

        setTextbooks((prev) => [...prev, newTextbook]);
        onTextbookUpload(newTextbook);
        Alert.alert('Success', 'Textbook processed successfully');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const removeTextbook = (id: string) => {
    setTextbooks((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <View style={styles.container}>
      <View style={{ paddingTop: 60 }}></View>
      <Button title="Upload Textbook" onPress={handleUpload} />

      <FlatList
        data={textbooks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.textbookItem}>
            <FontAwesome name="file-pdf-o" size={24} color="#e74c3c" />
            <View style={styles.textbookInfo}>
              <Text style={styles.textbookName}>{item.name}</Text>
              <Text numberOfLines={1} style={styles.textbookPreview}>
                {item.extractedText.slice(0, 50)}...
              </Text>
              <Text style={styles.uploadDate}>
                Uploaded: {item.uploadedAt.toLocaleDateString()}
              </Text>
            </View>
            <TouchableOpacity onPress={() => removeTextbook(item.id)} style={styles.deleteButton}>
              <FontAwesome name="trash-o" size={20} color="#c0392b" />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No textbooks uploaded yet</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  textbookItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#eee',
  },
  textbookInfo: {
    flex: 1,
    marginLeft: 15,
  },
  textbookName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#2c3e50',
  },
  textbookPreview: {
    color: '#7f8c8d',
    fontSize: 14,
    marginTop: 4,
  },
  uploadDate: {
    color: '#95a5a6',
    fontSize: 12,
    marginTop: 4,
  },
  deleteButton: {
    padding: 8,
    marginLeft: 10,
  },
  emptyText: {
    textAlign: 'center',
    color: '#95a5a6',
    marginTop: 20,
  },
  cancelButton: {
    borderRadius: 10,
    alignContent: 'center',
    justifyContent: 'center',
    width: '60%',
    backgroundColor: 'gray',
  },
});

export default UploadScreen;
