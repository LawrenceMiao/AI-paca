
import pic1 from "../assets/animal.png";
import pic2 from "../assets/upload.png";
import pic3 from "../assets/analyze.png";
import SectionAbout from "../components/SectionAbout";

//attributes for Illustrations
//There attributions page requires that images are cited. Each image made by the same company may be cited once
//Add section: made by stroyset from storyset.com
const About = () => {
  return (
    <>
      <SectionAbout
        title="Save the Animals!" num="01"
        desc="Assist ecologists in preserving and promoting the conservation of animal species by supporting their efforts to protect natural habitats, 
          study wildlife populations, and implement strategies to mitigate the effects of climate change and human activities. 
          By contributing to conservation initiatives, you help ensure the survival of endangered species, maintain biodiversity, 
          and promote the health of ecosystems that are vital for the planet. " pic={pic1} />
      <SectionAbout title="Upload Data" num="02" desc="It is simple to get started, just download our app on your phone. Then, look for wildlife animals near you,
      snap a photo and upload it through our app. That's it! We will take care of the data extraction, analysis, and provide the data to scientists around the world. 
      " pic={pic2} />
      <SectionAbout title="Vizualize Data" num="03" desc="As an ecologist or environmental enthusiast, you gain access to a wealth of global wildlife data, 
      supported by contributions from our community of users. Our AI technology classifies the photos for you, allowing you to focus on analyzing the data. 
      Additionally, you have the option to download the data for your own use." pic={pic3} />
      <p className="text-xs float-right">All images made by storyset from stroyset.com</p>
    </>
  );
};

export default About;