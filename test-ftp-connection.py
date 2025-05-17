#!/usr/bin/env python3
import ftplib
import os
import sys
from dotenv import load_dotenv

# Last inn variabler fra .env filen
load_dotenv()

# Få FTP-innstillinger fra .env
ftp_server = os.getenv("FTP_SERVER", "")
ftp_username = os.getenv("FTP_USERNAME", "")
ftp_password = os.getenv("FTP_PASSWORD", "")

print(f"Tester FTP-tilkobling til: {ftp_server}")
print(f"FTP brukernavn: {ftp_username}")
print(f"FTP passord: {'*' * len(ftp_password)}")

try:
    # Forsøk å koble til med vanlig FTP
    print("\nTester standard FTP-tilkobling...")
    with ftplib.FTP(ftp_server, timeout=30) as ftp:
        print(f"Koblet til {ftp_server}")
        print(f"Server melding: {ftp.getwelcome()}")
        
        print("\nLogger inn...")
        ftp.login(user=ftp_username, passwd=ftp_password)
        print("Innlogget!")
        
        print("\nLister filer i rotmappen:")
        files = ftp.nlst()
        for file in files:
            print(f"- {file}")
            
        print("\nFTP-tilkobling vellykket!")
except Exception as e:
    print(f"\nFTP-tilkobling feilet: {str(e)}")
    
    # Prøv med eksplisitt FTPS (FTP med SSL/TLS)
    try:
        print("\nTester eksplisitt FTPS-tilkobling...")
        with ftplib.FTP_TLS(ftp_server, timeout=30) as ftps:
            print(f"Koblet til {ftp_server} med TLS")
            print(f"Server melding: {ftps.getwelcome()}")
            
            print("\nLogger inn...")
            ftps.login(user=ftp_username, passwd=ftp_password)
            ftps.prot_p()  # Sikre dataoverføring
            print("Innlogget med TLS!")
            
            print("\nLister filer i rotmappen:")
            files = ftps.nlst()
            for file in files:
                print(f"- {file}")
                
            print("\nFTPS-tilkobling vellykket!")
    except Exception as e2:
        print(f"\nFTPS-tilkobling feilet også: {str(e2)}")
        print("\nDetaljer om feil:")
        print(f"FTP feil: {str(e)}")
        print(f"FTPS feil: {str(e2)}")
        sys.exit(1)
