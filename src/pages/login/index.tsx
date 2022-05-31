import { useState } from 'react';
import { useForm } from 'react-hook-form';

import GlobalLayout from '../../components/layout';
import { useAuth } from '../../config/auth';

import './login.css';

type FormData = {
  email: string;
  code: string;
};

export default function Login() {
  const { signIn, verifyCode } = useAuth();
  const { register, handleSubmit } = useForm<FormData>();
  const [ showCode, setShowCode ] = useState(false);

  const onSubmit = async (data: any) => {
    try {
      if (data.code) {
        console.log('attempt verify');
        await verifyCode(data.code);
        setShowCode(false);
      } else {
        console.log('attempt signin');
        await signIn(data.email);
        setShowCode(true);
      }
    } catch (e) {
      console.log(e)
    }
  };

  return (
    <GlobalLayout>
      <head>
        <title>Login</title>
      </head>
      <div className='center-div'>
        <div className='bg-image'/>
        <div className='login-div'>
          <h1>Sign In</h1>
          <form onSubmit={handleSubmit(onSubmit)}>
            {showCode?'Code: ':'Email: '}
            <input {...(showCode?
              register("code", { required: true }):
              register("email", { required: true }))} />
            <br />
            <input type="submit" />
          </form>
        </div>
      </div>
    </GlobalLayout>
  );
}
