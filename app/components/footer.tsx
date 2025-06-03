import Container from "./ui/container"
import { FaGithub , FaLinkedin , FaTwitterSquare , FaInstagram  } from "react-icons/fa";
import Link from "next/link";

const Footer= ()=>{
    return (
        <Container>
            <div className=" px-2 flex flex-row items-center mx-6 gap-6 ml-[40px] mb-6">
                <Link href={`https://github.com/Roshanchau`}><FaGithub size={25} /></Link>
                <Link href={`https://www.linkedin.com/in/roshan-chaudhary-429381211/`}><FaLinkedin size={25}/></Link>
                <Link href={`https://x.com/RoshanChau44463`}><FaTwitterSquare size={25}/></Link>
                <Link href={`https://www.instagram.com/roshan__chau/`}><FaInstagram size={25}/></Link>
            </div>
        </Container>
    )
}

export default Footer