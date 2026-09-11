import RegisterForm from "./RegisterForm";

const RegisterPage = () => {
    return (
        <section className="bg-white min-h-screen flex items-center justify-center">
            <div className="max-w-7xl mx-auto px-4 w-full">
                <div className="flex justify-center">
                    <RegisterForm />
                </div>
            </div>
        </section>
    );
};

export default RegisterPage;
