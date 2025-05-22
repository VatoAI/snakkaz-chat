#!/bin/bash
# Script to enable leaked password protection in Supabase Auth
# This script documents the steps needed to enable the feature

echo "================================================"
echo "Enabling Leaked Password Protection in Supabase"
echo "================================================"
echo
echo "Since this requires access to the Supabase dashboard or CLI,"
echo "this script will guide you through the steps:"
echo

# Check if we have Supabase CLI installed
if command -v supabase &> /dev/null
then
    echo "Supabase CLI detected. You can run the following command:"
    echo "supabase auth config set --auth.enable_hibp true"
    echo
    echo "Would you like to attempt to run this command now? (y/n)"
    read -r RESPONSE
    if [[ "$RESPONSE" =~ ^([yY][eE][sS]|[yY])$ ]]
    then
        echo "Executing: supabase auth config set --auth.enable_hibp true"
        supabase auth config set --auth.enable_hibp true
        echo "Please verify in the dashboard that the setting was updated."
    fi
else
    echo "Supabase CLI not detected. Please follow the manual steps:"
    echo
    echo "1. Log in to the Supabase dashboard at https://app.supabase.com"
    echo "2. Select your project"
    echo "3. Go to Authentication > Settings"
    echo "4. Scroll down to the \"Security\" section"
    echo "5. Enable \"HaveIBeenPwned Digest\" option"
    echo "6. Save changes"
fi

echo
echo "After enabling this feature, Supabase will check if user passwords"
echo "have been leaked in known data breaches by using a secure hash."
echo "This adds an extra layer of security for your users without"
echo "compromising their privacy."
echo
echo "The feature has been documented as enabled in your codebase."
