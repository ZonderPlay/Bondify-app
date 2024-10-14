import style from './Login.module.scss';
import { LoginBlock } from '../../modules/login-block';
const LoginPage = () => {
    return (
        <div className={style.login_app}>
            <LoginBlock />
        </div>
    )
}
export {LoginPage};