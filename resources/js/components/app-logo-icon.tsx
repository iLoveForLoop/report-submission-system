import { SVGAttributes } from 'react';
import logo from '../../images/dilg-main-logo.png';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <img src={logo} alt="dilgLogo" />
    );
}
