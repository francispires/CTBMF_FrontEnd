import { useEffect } from 'react';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useSelector, useDispatch } from 'react-redux';

import { history } from '../_helpers';
import { authActions } from '../app/slices/auth/index.ts';

export { Login };

function Login() {
    const dispatch = useDispatch();
    const authUser = useSelector(x => x.auth.user);
    const authError = useSelector(x => x.auth.error);

    useEffect(() => {
        // redirect to home if already logged in
        if (authUser) history.navigate('/');

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // form validation rules 
    const validationSchema = Yup.object().shape({
        username: Yup.string().required('Username is required'),
        password: Yup.string().required('Password is required')
    });
    const formOptions = { resolver: yupResolver(validationSchema) };

    // get functions to build form with useForm() hook
    const { register, handleSubmit, formState } = useForm(formOptions);
    const { errors, isSubmitting } = formState;

    function onSubmit({ username, password }) {
        return dispatch(authActions.login({ username, password }));
    }

    return (
        <div className="col-md-6 offset-md-3 mt-5">
            <div className="alert alert-info" hidden>
                Username: test<br />
                Password: test
            </div>

            <div className="px-4 pt-4 flex-col justify-start items-start gap-2 inline-flex">
                <div className="w-80 text-black text-3xl font-bold font-['Roboto'] leading-10">Olá 👋</div>
            </div><br/>
            <div className="pt-6 flex-col justify-start items-center gap-3 inline-flex">
                <input type="text" placeholder="Email" className="px-6 py-2 bg-gray-100 rounded-2xl justify-start items-center gap-3 inline-flex text-black">
                </input>
                <input type="password" placeholder="Senha" className="px-6 py-2 bg-gray-100 rounded-2xl justify-start items-center gap-3 inline-flex text-black">
                </input>
            </div>
            <br/>
            <div className="p-4 flex-col justify-start items-start gap-3 inline-flex">
                <div className="p-4 rounded-3xl justify-center items-center gap-2 inline-flex">
                    <div className="text-center text-blue-600 text-sm font-medium font-['Roboto'] leading-normal">Esqueceu a senha?</div>
                </div>
            </div>

            <div className="card" hidden>
                <h4 className="card-header">Login</h4>
                <div className="card-body">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-group">
                            <label>Username</label>
                            <input name="username" type="text" {...register('username')} className={`form-control ${errors.username ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.username?.message}</div>
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input name="password" type="password" {...register('password')} className={`form-control ${errors.password ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.password?.message}</div>
                        </div>
                        <button disabled={isSubmitting} className="btn btn-primary">
                            {isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                            Login
                        </button>
                        {authError &&
                            <div className="alert alert-danger mt-3 mb-0">{authError.message}</div>
                        }
                    </form>
                </div>
            </div>
        </div>
    )
}
