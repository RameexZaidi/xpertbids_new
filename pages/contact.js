import ContactForm from "../components/ContactForm";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
const Contact = () => {
  return (
    <>
    <Header />
    <div className="color py-5" >
      <ContactForm />
    </div>
    <Footer />
    </>
  );
};

export default Contact;
