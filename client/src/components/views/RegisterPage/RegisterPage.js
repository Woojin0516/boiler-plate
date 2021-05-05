import React, { useState} from 'react'
import { useDispatch } from 'react-redux';
import { registerUser } from '../../../_actions/user_action';
import { withRouter } from 'react-router-dom';
function RegisterPage(props) {
    const dispatch = useDispatch();
     
    //서버에가지고있는것 값을
    const [Email, setEmail] = useState("")
    const [Password, setPassword] = useState("")
    const [Name, setName] = useState("")
    const [ConfirmPassword, setConfirmPassword] = useState("")
    
    
    const onEmailHandler = (event) => {
        setEmail(event.currentTarget.value)
    }

    const onNamedHandler = (event) => {
        setName(event.currentTarget.value)
    }

    const onPasswordHandler = (event) => {
        setPassword(event.currentTarget.value)
    }

    const onConfirmPasswordHandler = (event) => {
        setConfirmPassword(event.currentTarget.value)
    }


    const onSubmitHandler = (event) =>{
        //리프레쉬 방지
        event.preventDefault();
       
        if(Password!==ConfirmPassword){
            return alert('비밀번호와 비밀번호 확인은 같아야합니다.')
        }

        let body = {
            email: Email,
            password: Password,
            name: Name
            

        }

        dispatch(registerUser(body))
        .then(response => {
            if(response.payload.success){
                props.history.push("/login")
            }else{
                alert("회원 가입에 실패했습니다.")
            }
        })
       

        
    }
    return (
        <div style={{ 
            display: 'flex' , justifyContent: 'center' , alignItems: 'center'
            , width: '100%', height: '100vh'
        }} >
            <form style={{display:'flex' , flexDirection: 'column'}}
            onSubmit={onSubmitHandler}>
                
                <label>Email</label>
                <input type="email" value={Email} onChange={onEmailHandler}></input>

                <label>name</label>
                <input type="text" value={Name} onChange={onNamedHandler}></input>

                <label>PassWord</label>
                <input type="password" value={Password} onChange={onPasswordHandler}></input>

                <label>Confirm PassWord</label>
                <input type="password" value={ConfirmPassword} onChange={onConfirmPasswordHandler}></input>

                <br/>
                <button>
                    회원가입
                </button>
            </form>
        </div>
    )
}

export default withRouter(RegisterPage)
