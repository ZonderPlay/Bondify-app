import style from './LoginApp.module.scss';
import { LoginBlock } from '../../modules/login-block';
const LoginAppPage = () => {
    return (
        <div className={style.login_app}>
            <LoginBlock />
        </div>
    )
}
export {LoginAppPage};