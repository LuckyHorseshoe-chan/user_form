import { ChangeEvent, useState, useRef } from 'react';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons'
import { Link } from 'react-router-dom'
import axios from 'axios';
import {
  FormLabel,
  FormControl,
  Input,
  Button,
  Text,
  Box,
  Center,
  Flex,
  Spacer,
  EditableInput,
  Editable,
  EditablePreview,
  IconButton
} from '@chakra-ui/react'
import MapComponent from './MapComponent'
import { useAppDispatch, useAppSelector } from '../hooks';
import { 
    selectForm, setFirstName, setLastName, 
    setPatronymic, setEmail, setPhone, addField, 
    removeField, setExtraFieldName, setExtraFieldValue
} from '../features/formSlice';
import EditableControls from './EditableControls';

function Form(){
    const [errors, setErrors] = useState({
        firstName: '',
        lastName: '',
        patronymic: '',
        email: '',
        phone: ''
    })

    const [fileList, setFileList] = useState<File[]>([]);
    const [fileMessage, setFileMessage] = useState('')
    const [_size, setSize] = useState(0)
    const [strSize, setStrSize] = useState('0 KB')
    const [fileNames, setFileNames] = useState<string[]>([])
    const [msg, setMsg] = useState('')
    const [success, setSuccess] = useState('')
    const fileInputRef = useRef<HTMLInputElement>(null);

    const form = useAppSelector(selectForm)
    const dispatch = useAppDispatch()
    
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) {
            return;
        }
        setFileMessage('')
        const names = []
        const files = [...fileList, ...Array.from(e.target.files)]
        const validFiles = [] 
        var totalBytes = 0;
        for (let i = 0; i < files.length; i++){
            if (files[i].type === 'application/pdf') {
                validFiles.push(files[i])
                names.push(files[i].name)
                totalBytes += files[i].size
            }
            else setFileMessage('Некорректный формат, принимаются только файлы PDF')
        }
        if (totalBytes/1000000 > 5) setFileMessage("Суммарный объём не должен превышать 5 МБ")
        else { 
            setSize(totalBytes/1000000)
            setStrSize(_size.toPrecision(3) + ' MB'); 
            setFileList(validFiles) 
            setFileNames(names)
        };
    };

    const chooseFile = () => {
        if(fileInputRef.current) {fileInputRef.current.click()}
    }

    function onSubmit(e: React.MouseEvent<HTMLButtonElement>) {
        setMsg('')
        setSuccess('')
        const openInNewTab = (url: string) => {
            window.open(url, "_blank", "noreferrer");
        };
        fetch('http://localhost:8000/data', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({"data": form}),
        })
        .then((res) => res.json())
        .then((data) => {
            if (data['message'] !== 'ок') setMsg(data['message'])
            else openInNewTab(`http://localhost:8080/${data['id']}.pdf`)
            if (fileList.length && data['message'] === 'ок'){
                let formData = new FormData();
                for (var i = 0; i < fileList.length; i++){
                    formData.append('files', fileList[i])
                }
                axios.post('http://localhost:8000/files', formData, { 
                    headers: { "Content-Type": "multipart/form-data" }
                })
                .then((data) => {
                    if (msg === '') setSuccess("Форма успешно отправлена")
                    setFileList([])
                    setFileNames([])
                    setStrSize('0 KB')
                    setSize(0)
                })
                .catch((err) => {
                    console.log(err)
                    setMsg("Не удалось подключиться к серверу")
                })
            }
        })
        .catch((err) => {
            console.log(err)
            setMsg("Не удалось подключиться к серверу")
        })
      }

    return(
        <Box>
            <Flex p={3}>
                <Spacer/>
                <Link to='/mobile'>Мобильная версия</Link>
            </Flex>
            <Center>
                <Box w='50vw' mt={5}>
                    <form>
                        <FormControl>
                            <FormLabel htmlFor='lastName'>Фамилия</FormLabel>
                            <Input
                                id='lastName'
                                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                    const text = e.target.value
                                    dispatch(setLastName(text))
                                    const check = text.match(/^[А-ЯЁ][а-яё]+$/)
                                    const tmp = errors
                                    if (!(/^[А-ЯЁ][а-яё]+$/.test(text)) ||
                                        ((check != null) && (text !== check[0]))) {
                                            tmp.lastName = 'Некорректные данные'
                                        }
                                    else {
                                        tmp.lastName = ''
                                    } 
                                    if (text === ''){
                                        tmp.lastName = 'Это обязательное поле!'
                                    }
                                    setErrors(tmp)
                                }}
                                isInvalid={errors.lastName ? true : false}
                            />
                            <Text color='red'>
                                {errors.lastName}
                            </Text>
                            <FormLabel htmlFor='firstName'>Имя</FormLabel>
                            <Input
                                id='firstName'
                                onChange={(e: ChangeEvent<HTMLInputElement>) => 
                                    {
                                        const text = e.target.value
                                        dispatch(setFirstName(text))
                                        const check = text.match(/^[А-ЯЁ][а-яё]+$/)
                                        const tmp = errors
                                        if (!(/^[А-ЯЁ][а-яё]+$/.test(text)) ||
                                            ((check != null) && (text !== check[0]))) {
                                                tmp.firstName = 'Некорректные данные'
                                            }
                                        else {
                                            tmp.firstName = ''
                                        } 
                                        if (text === ''){
                                            tmp.firstName = 'Это обязательное поле!'
                                        }
                                        setErrors(tmp)
                                    }
                                }
                                isInvalid={errors.firstName ? true : false}
                            />
                            <Text color='red'>
                                {errors.firstName}
                            </Text>
                            <FormLabel htmlFor='patronymic'>Отчество</FormLabel>
                            <Input
                                id='patronymic'
                                onChange={(e: ChangeEvent<HTMLInputElement>) => 
                                    {
                                        const text = e.target.value
                                        dispatch(setPatronymic(text))
                                        const check = text.match(/^[А-ЯЁ][а-яё]+$/)
                                        const tmp = errors
                                        if (!(/^[А-ЯЁ][а-яё]+$/.test(text)) ||
                                            ((check != null) && (text !== check[0]))) {
                                                tmp.patronymic = 'Некорректные данные'
                                            }
                                        else {
                                            tmp.patronymic = ''
                                        }
                                        setErrors(tmp)
                                    }
                                }
                                isInvalid={errors.patronymic ? true : false}
                            />
                            <Text color='red'>
                                {errors.patronymic}
                            </Text>
                            <FormLabel htmlFor='email'>Email</FormLabel>
                            <Input
                                id='email'
                                onChange={(e: ChangeEvent<HTMLInputElement>) => 
                                    {
                                        const text = e.target.value
                                        dispatch(setEmail(text))
                                        const check = text.match(/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/)
                                        const tmp = errors
                                        if (!(/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/.test(text)) ||
                                            ((check != null) && (text !== check[0]))) {
                                                tmp.email = 'Некорректные данные'
                                            }
                                        else {
                                            tmp.email = ''
                                        } 
                                        if (text === ''){
                                            tmp.email = 'Это обязательное поле!'
                                        }
                                        setErrors(tmp)
                                    }
                                }
                                isInvalid={errors.email ? true : false}
                            />
                            <Text color='red'>
                                {errors.email}
                            </Text>
                            <FormLabel htmlFor='phone'>Телефон</FormLabel>
                            <Input
                                id='phone'
                                placeholder="+79999999999"
                                onChange={(e: ChangeEvent<HTMLInputElement>) => 
                                    {
                                        const text = e.target.value
                                        dispatch(setPhone(text))
                                        const check = text.match(/\+7\d{10}/)
                                        const tmp = errors
                                        if (!(/\+7\d{10}/.test(text)) ||
                                            (check != null) && (text !== check[0])) {
                                                tmp.phone = 'Некорректные данные'
                                            }
                                        else {
                                            tmp.phone = ''
                                        } 
                                        if (text === ''){
                                            tmp.phone = 'Это обязательное поле!'
                                        }
                                        setErrors(tmp)
                                    }
                                }
                                isInvalid={errors.phone ? true : false}
                            />
                            <Text color='red'>
                                {errors.phone}
                            </Text>
                            <FormLabel htmlFor='address'>Адрес</FormLabel>
                            <Input
                                id='address'
                                value={form[5].value}
                                isDisabled
                            />
                            <MapComponent/>
                            <FormLabel>Загрузка файлов</FormLabel>
                            <Flex>
                                <Button onClick={chooseFile}>
                                    Choose file
                                </Button>
                                <Center>
                                    <Text ml={2}>{strSize}</Text>
                                </Center>
                                <Spacer/>
                            </Flex>
                            <Flex>
                                <Text noOfLines={1}>{fileNames.join(', ')}</Text>
                                <Spacer/>
                            </Flex>
                            <Text color='red'>{fileMessage}</Text>
                            <Input 
                                type="file"
                                ref={fileInputRef} 
                                style={{ display: 'none'}}
                                onChange={handleFileChange} 
                                multiple />
                            {form.slice(6)?.map((item: any, i: number) => (
                                <Box>
                                    <Editable
                                    textAlign='center'
                                    defaultValue='Название'
                                    as='b'
                                    isPreviewFocusable={false}
                                    >
                                        <Flex mt={3}>
                                            <EditablePreview />
                                            <Input as={EditableInput} onChange={(e: ChangeEvent<HTMLInputElement>) => 
                                                dispatch(setExtraFieldName({index: 6 + i, value: e.target.value}))}/>
                                            <EditableControls />
                                            <IconButton 
                                                aria-label='delete' 
                                                bg='red.500' 
                                                icon={<DeleteIcon color='white'/>}
                                                onClick={() => dispatch(removeField(6 + i))} 
                                                size='sm' 
                                                ml={1}/>
                                        </Flex>
                                    </Editable>
                                    <Input mt={3} onChange={(e: ChangeEvent<HTMLInputElement>) => 
                                                dispatch(setExtraFieldValue({index: 6 + i, value: e.target.value}))}/>
                                </Box> 
                            ))}
                            <Flex mt={5}>
                                <Button onClick={() => dispatch(addField())} color='white' bg='blue.400'>
                                    <AddIcon mr={2}/> Добавить поле
                                </Button>
                                <Spacer/>
                            </Flex>
                        </FormControl>   
                        <Text color='red'>{msg}</Text>
                        <Text color='green'>
                            {success}
                        </Text>
                        <Flex>
                            <Spacer/>
                            <Button mt={4} colorScheme='teal' onClick={onSubmit}>
                                Submit
                            </Button>
                        </Flex>
                    </form>
                </Box>
            </Center>
        </Box>
    )
}

export default Form;