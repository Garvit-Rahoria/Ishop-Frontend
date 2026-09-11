import LoginForm from "./LoginForm";

const LoginPage = () => {

    return (
        <section className="bg-white min-h-screen flex items-center justify-center">
            <div className="max-w-7xl mx-auto px-4 w-full">
                <div className="flex justify-center">
                    <LoginForm />
                </div>
            </div>
        </section>
    );
};

export default LoginPage;
