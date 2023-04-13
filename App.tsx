import React, {useEffect, useState} from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Image,
  Dimensions,
  TextInput,
  Modal,
  TouchableOpacity
} from 'react-native';
import axios from 'axios';

import colors from './src/constants/colors';
import { Button } from './src/components'

function App(): JSX.Element {
  const [contacts, setContacts] = useState<any[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [detailID, setDetailID] = useState<any>(null);
  const isDarkMode = useColorScheme() === 'dark';
  const [newContactData, setNewContactData] = useState([
    {
      label: 'firstName',
      placeHolder: 'First Name',
      value: ''
    },
    {
      label: 'lastName',
      placeHolder: 'Last Name',
      value: ''
    },
    {
      label: 'age',
      placeHolder: 'Age',
      value: ''
    }
  ])

  const backgroundStyle = {
    backgroundColor: isDarkMode ? colors.orange : colors.yellow2,
  };

  const fetchContacts = async () => {
    try {
      const response = await axios.get('https://contact.herokuapp.com/contact');
      console.log('response :>> ', response.data.data);
      setContacts(response.data.data)
    } catch (error) {
      console.log('error :>> ', error);
    }
  }

  const openDetail = (index:number) => {
    let data = [...newContactData]
    data.forEach((el, i) => {
      switch (i) {
        case 0:
          el.value = contacts[index].firstName;
          break;
        case 1:
          el.value = contacts[index].lastName;
          break;
        case 2:
          el.value = contacts[index].age+"";
          break;
        default:
          break;
      }
    })
    console.log('data :>> ', data);
    setNewContactData(data)
    setDetailID(contacts[index].id)
    setModalVisible(true)
  }

  const changeData = (i:number, value:string) => {
    let data = [...newContactData];
    if (data[i].label === 'age') {
      if (value.match(/^[0-9]+$|^$/)) {
        data[i].value = value;
      }
    } else {
      data[i].value = value;
    }
    setNewContactData(data)
  }

  const resetData = () => {
    let data = [...newContactData];
      data.forEach(el => el.value = "")
      setNewContactData(data)
  }

  const postContact = async () => {
    try {
      let data = {
        "firstName": "",
        "lastName": "",
        "age": 0,
        "photo": "N/A"
      }
      newContactData.forEach(contactData => {
        switch (contactData.label) {
          case 'firstName':
            data['firstName'] = contactData.value;
            break;
          case 'lastName':
            data['lastName'] = contactData.value;
            break;
          case 'age':
            data['age'] = parseInt(contactData.value);
            break;
          default:
            break;
        }
      })
      const response = await axios.post('https://contact.herokuapp.com/contact', data);
      console.log('response :>> ', response);
    } catch (error) {
      console.log('error :>> ', error);
    } finally {
      resetData()
      setDetailID(null)
      fetchContacts()
      setModalVisible(false)
    }
  }

  const editContact = async (ID:string) => {
    try {
      let data = {
        "firstName": "",
        "lastName": "",
        "age": 0,
        "photo": "N/A"
      }
      newContactData.forEach(contactData => {
        switch (contactData.label) {
          case 'firstName':
            data['firstName'] = contactData.value;
            break;
          case 'lastName':
            data['lastName'] = contactData.value;
            break;
          case 'age':
            data['age'] = parseInt(contactData.value);
            break;
          default:
            break;
        }
      })
      console.log('data edit :>> ', data);
      const response = await axios.put('https://contact.herokuapp.com/contact/' + ID, data);
      console.log('response :>> ', response);
    } catch (error) {
      console.log('error :>> ', error);
    } finally {
      resetData()
      setDetailID(null)
      fetchContacts()
      setModalVisible(false)
    }
  }

  const deleteContact = async (ID:string) => {
    try {
      const response = await axios.delete('https://contact.herokuapp.com/contact/' + ID);
      console.log('response :>> ', response);
    } catch (error) {
      console.log('error :>> ', error);
    } finally {
      resetData()
      setDetailID(null)
      fetchContacts()
      setModalVisible(false)
    }
  }

  useEffect(() => {
    fetchContacts()
  }, [])

  useEffect(() => {
    if (searchValue) {
      const result = contacts.filter(contact => { 
        let fullName = `${contact.firstName} ${contact.lastName}`
        return fullName.toLowerCase().includes(searchValue.toLowerCase())
      })
      setContacts(result)
    } else {
      fetchContacts()
    }
  }, [searchValue])
  
  

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <View
        style={{
          backgroundColor: colors.yellow,
          height: '100%',
          paddingHorizontal: 20,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <View
          style={{
            backgroundColor: colors.yellow,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            width: Dimensions.get("window").width,
            alignItems: 'center',
          }}
        >
          <Image
            style={styles.logo}
            source={{
              uri: 'https://seeklogo.com/images/Y/yellow-pages-turkey-logo-6D09162597-seeklogo.com.png',
            }}
          />
          <Text
            style={{
              fontSize: 100,
              marginLeft: 10,
              color: colors.black
            }}
          >
            Z
          </Text>
        </View>
        <View
          style={{
            height: Dimensions.get('window').height/1.5,
            overflow:'hidden',
            paddingHorizontal: '5%',
            paddingTop: 20,
            width: Dimensions.get('window').width
          }}
        >
          <TextInput
            value={searchValue}
            onChangeText={text => setSearchValue(text)}
            placeholder='Search Contact by Name...'
            placeholderTextColor={colors.brown}
            style={{
              width: "100%",
              paddingVertical: 8,
              paddingHorizontal: 16,
              borderRadius: 7,
              borderColor: colors.brown,
              borderWidth: 1,
              marginBottom: 40,
              fontSize: 18,
              color: colors.black,
            }}
          />
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={{
             
            }}
          >
            {
              contacts.map((contact, i) => {
                return (
                  <TouchableOpacity
                    key={i}
                    style={{
                      ...styles.contactCard,
                      marginBottom: i === contacts.length -1 ? 20 : 8,
                    }}
                    onPress={() => openDetail(i)}
                  >
                    <View style={styles.contactCardInfo}>
                      <Text style={styles.contactCardName} >{`${contact.firstName} ${contact.lastName}`}</Text>
                      <Text>{`${contact.age} years old`}</Text>
                    </View>
                    <Image
                      style={styles.contactCardIcon}
                      source={{
                        uri: 'https://icons.veryicon.com/png/o/internet--web/iview-3-x-icons/md-contact.png',
                      }}
                    />
                  </TouchableOpacity>
                  
                )
              })
            }
          </ScrollView>
        </View>
        <Button onPress={() => setModalVisible(true)} style='primary' text='Add New Contact'/>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(false);
          }}
        >
          <View
            style={{
              width:"100%",
              height: '100%',
              backgroundColor: 'rgba(0,0,0,0.7)',
              position:"absolute",
              // bottom: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: 20
            }}
          >
            <View
              style={{
                width: '80%',
                padding: 20,
                backgroundColor: colors.yellow2,
                borderRadius: 7,
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 2
                },
                shadowOpacity: 0.25,
                shadowRadius: 4,
                elevation: 5,
                }}
            >
              {
                newContactData.map((data, i) => {
                  return (
                    <TextInput
                      key={data.label}
                      placeholder={data.placeHolder}
                      placeholderTextColor={colors.brown}
                      style={styles.modalInput}
                      value={ data.value}
                      onChangeText={text => changeData(i, text)}
                    />
                  )
                })
              }
              {
                !detailID &&
                  <Button onPress={postContact} style='primary' text='Add Contact'/>
              }
              {
                detailID !== null &&
                  <Button onPress={() => editContact(detailID)} style='primary' text='Edit'/>
              }
              {
                detailID !== null &&
                  <Button onPress={() => deleteContact(detailID)} style='tertiary' text='Delete'/>
              }
              <Button onPress={() => {setDetailID(null); setModalVisible(false); resetData()}} style='secondary' text='Cancel'/>
            </View>
          </View>
        </Modal>

      </View>
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 100,
    height: 100,
  },
  homeBg: {
    backgroundColor: colors.yellow,
    height: '100%',
  },
  contactCard: {
    padding: 16,
    borderRadius: 7,
    borderColor: colors.brown,
    borderWidth: 2,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  contactCardIcon: {
    width: 40,
    height: 40,
  },
  contactCardInfo: {
    display: 'flex',
    alignItems: 'flex-start',
  },
  contactCardName: {
    fontSize: 20,
    color: colors.black
  },
  modalInput: {
    width: "100%",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 7,
    borderColor: colors.brown,
    borderWidth: 1,
    marginBottom: 10,
    color: colors.black,
    fontSize: 18
  }
});

export default App;
