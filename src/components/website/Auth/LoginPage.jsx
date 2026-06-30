import Image from "next/image";
import LoginForm from "./LoginForm";

const LoginPage = () => {

    return (
        <section className="bg-white min-h-screen flex items-center">
            <div className="max-w-7xl mx-auto px-4 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* Left Illustration */}
                    <div className="hidden lg:flex justify-center">
                        <Image
                            src="/auth/login-illustration.png"
                            alt="Login"
                            width={500}
                            height={500}
                            className="object-contain"
                        />
                    </div>

                    {/* Right Form */}
                    <LoginForm />

                </div>
            </div>
        </section>
    );
};

export default LoginPage;
