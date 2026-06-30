const ContactForm = () => {
    return (
        <form className="space-y-6">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                    name="firstName"
                    required
                    placeholder="First Name *"
                    className="input"
                />
                <input
                    name="lastName"
                    required
                    placeholder="Last Name *"
                    className="input"
                />
            </div>

            <input
                name="email"
                type="email"
                required
                placeholder="Email Address *"
                className="input"
            />

            <input
                name="phone"
                placeholder="Phone Number (Optional)"
                className="input"
            />

            <select
                name="country"
                required
                className="input"
            >
                <option>United States (US)</option>
                <option>United Kingdom (UK)</option>
            </select>

            <input
                name="subject"
                placeholder="Subject (Optional)"
                className="input"
            />

            <textarea
                name="message"
                placeholder="Note about your order, e.g. special note for delivery"
                className="input h-32"
            />

            <label className="flex items-start gap-2 text-sm text-gray-600">
                <input type="checkbox" />
                <span>
                    I want to receive news and updates once in a while. By submitting,
                    I’m agreed to the{" "}
                    <span className="text-green-600 cursor-pointer">
                        Terms & Conditions
                    </span>
                </span>
            </label>

            <button
                type="submit"
                className="bg-teal-600 text-white px-8 py-3 rounded-lg font-medium"
            >
                SEND MESSAGE
            </button>
        </form>
    );
};

export default ContactForm;
