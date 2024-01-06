import { Inter } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs'
import "../globals.css";
import LeftSideBar from "@components/layout/LeftSideBar";
import TopBar from "@components/layout/TopBar";
import MainContainer from "@components/layout/MainConatainer";
import RightSideBar from "@components/layout/RightSideBar";
import BottomBar from "@components/layout/BottomBar";


export const metadata = {
    title: 'eWa Community App',
    description: 'Next.js eWa Community App',
}

const inter = Inter({ subsets: ['latin'] }) 


export default function RootLayout({ children }) {
    return (
        <ClerkProvider>
            <html lang="en">
                <body className={`${inter.className} bg-purple-1 text-light-1`}>
                    <main className="flex flex-row">
                        <LeftSideBar/>
                        <MainContainer>
                            {children}
                        </MainContainer>
                        <RightSideBar />
                    </main>
                    <BottomBar />
                </body>
            </html>
        </ClerkProvider> 
    );
}