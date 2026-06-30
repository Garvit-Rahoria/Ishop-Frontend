import Image from "next/image";
import {
    FaTwitter,
    FaFacebookF,
    FaInstagram,
    FaYoutube,
    FaPinterestP,
} from "react-icons/fa";

const ContactInfo = () => {
    return (
        <div className="space-y-6">

            {/* Info Card */}
            <div className="bg-gray-100 rounded-xl p-6 space-y-6 text-sm">

                {/* USA */}
                <div>
                    <p className="text-xs text-gray-500 mb-2">
                        UNITED STATES (HEAD QUATER)
                    </p>
                    <p>152 Thatcher Road St, Mahattan, 10463, US</p>
                    <p>(+025) 3886 25 16</p>
                    <p className="text-green-600">hello@swattecmart.com</p>
                </div>

                {/* UK */}
                <div>
                    <p className="text-xs text-gray-500 mb-2">
                        UNITED KINGDOM (BRANCH)
                    </p>
                    <p>12 Buckingham Rd, Thornthwaite, HG3 4TY, UK</p>
                    <p>(+718) 895-5350</p>
                    <p className="text-green-600">contact@swattecmart.co.uk</p>
                </div>

                {/* Social Icons */}
                <div className="flex gap-3 pt-2">
                    <a className="social-icon"><FaTwitter /></a>
                    <a className="social-icon"><FaFacebookF /></a>
                    <a className="social-icon"><FaInstagram /></a>
                    <a className="social-icon"><FaYoutube /></a>
                    <a className="social-icon"><FaPinterestP /></a>
                </div>
            </div>

            {/* Image */}
            <div className="rounded-xl overflow-hidden">
                <Image
                    src="/contact-image.jpg"
                    alt="Contact"
                    width={600}
                    height={400}
                    className="object-cover w-full h-full grayscale"
                />
            </div>

        </div>
    );
};

export default ContactInfo;
