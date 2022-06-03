import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Input, Button } from 'antd';
import { LeftOutlined, ArrowRightOutlined, LoadingOutlined } from '@ant-design/icons';

import GlobalLayout from '../../components/layout';
import { useAuth } from '../../config/auth';

import './login.css';

type IFormInput = {
  email: string;
  code: string;
};

export default function Login() {
  const { signIn, verifyCode } = useAuth();
  const { 
    control: eControl,
    handleSubmit: eSubmit, 
    formState: eState,
  } = useForm<IFormInput>();
  const { 
    control: cControl,
    handleSubmit: cSubmit, 
    formState: cState,
  } = useForm<IFormInput>();
  const [ showCode, setShowCode ] = useState(false);
  const [ emailError, setEmailError ] = useState(false);
  const [ codeError, setCodeError ] = useState(false);
  const [ isLoading, setIsLoading ] = useState(false);

  const onEmailSubmit = async (data: any) => {
    setIsLoading(true);
    setEmailError(false);
    try {
      if (data.email) {
        console.log(data.email);
        await signIn(data.email);
        setShowCode(true);
      }
    } catch (e) {
      setEmailError(true);
      console.log(e);
    }
    setIsLoading(false);
  }

  const onCodeSubmit = async (data: any) => {
    setIsLoading(true);
    setCodeError(false);
    try {
      if (data.code) {
        console.log(data.code);
        await verifyCode(data.code);
        setShowCode(false);
      }
    } catch (e) {
      setCodeError(true);
      console.log(e);
    }
    setIsLoading(false);
  };

  const onBack = async () => {
    setShowCode(false);
  }

  cSubmit(()=>null)();
  eSubmit(()=>null)();
  document.title='Login';
  return (
    <GlobalLayout login>
      <div className='center-div'>
        <div className='bg-image'/>
        <div className='login-div'>
          <h1 style={{alignSelf:'center', fontSize:'3.3em', fontWeight:'bold'}}>Sign In</h1>
          {showCode?
            <form onSubmit={cSubmit(onCodeSubmit)} className='form-div'>
              <Input.Group compact size='large' style={{display:'flex', flexDirection:'row'}}>
                <Button onClick={onBack} size='large' type='ghost' icon={<LeftOutlined/>} style={{borderStyle:'none'}}/>
                <Controller
                  name="code"
                  control={cControl}
                  rules={{ required: true, pattern: /^\d{4}$/}}
                  render={({ field }) => <Input {...field} status={codeError?'error':''} placeholder='0000'/>}
                />
                <Button
                  type={cState.isValid?'primary':'default'}
                  disabled={cState.isValid?false:true}
                  size='large'
                  onClick={cSubmit(onCodeSubmit) as () => void}
                  icon={isLoading?<LoadingOutlined/>:''}>
                    {!isLoading && 'Submit'}
                </Button>
              </Input.Group>
            </form>
            :
            <form onSubmit={eSubmit(onEmailSubmit)} className='form-div'>
              <Input.Group compact size='large' style={{display:'flex', flexDirection:'row'}}>
                <Controller
                  name="email"
                  control={eControl}
                  rules={{ required: true, pattern: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/}}
                  render={({ field }) => <Input {...field}
                    status={emailError?'error':''}
                    placeholder='email@example.com'
                  />}
                />
                <Button
                  type={eState.isValid?'primary':'default'}
                  disabled={eState.isValid?false:true}
                  size='large'
                  onClick={eSubmit(onEmailSubmit) as () => void}
                  icon={isLoading?<LoadingOutlined/>:<ArrowRightOutlined/>}
                />
              </Input.Group>
            </form>
          }
        </div>
      </div>
    </GlobalLayout>
  );
}
