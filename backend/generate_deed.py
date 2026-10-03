import pymupdf

def create_test_suite():
    # 1. AUTHENTIC DEED (Passes all 4 layers -> Risk Score: 0)
    doc1 = pymupdf.open()
    page1 = doc1.new_page()
    text1 = (
        "GOVERNMENT OF MAHARASHTRA - DEPARTMENT OF REGISTRATION & STAMPS\n"
        "------------------------------------------------------------------\n"
        "ABSOLUTE SALE DEED OF IMMOVABLE PROPERTY\n\n"
        "Property ID: 101\n"
        "Survey Number: SURVEY-PUNE-402/A\n"
        "Registered Owner (Vendor): Aarav Deshmukh\n"
        "Location: Plot No. 15, Hinjewadi Phase 2, Pune, Maharashtra - 411057\n"
        "Area: 4,200 Sq. Ft.\n"
        "Consideration Amount: Rs. 1,45,00,000/- (Rupees One Crore Forty-Five Lakh Only)\n\n"
        "WHEREAS the Vendor is the sole and absolute owner of the land bearing\n"
        "Survey Number SURVEY-PUNE-402/A free from all encumbrances, liens, and court cases.\n"
        "Signed & Sealed before the Sub-Registrar, Haveli-Pune."
    )
    page1.insert_text((50, 70), text1, fontsize=11)
    doc1.set_metadata({
        "producer": "NIC e-Registration Portal v4.2",
        "creator": "IGR Maharashtra Official Scanner",
        "creationDate": "D:20261002100000+05'30'",
        "modDate": "D:20261002100000+05'30'"
    })
    doc1.save("1_authentic_sale_deed.pdf")
    doc1.close()

    # 2. PHOTOSHOP / CANVA FORGED DEED (Fails Layer 1 Metadata -> Risk Score: 60)
    doc2 = pymupdf.open("1_authentic_sale_deed.pdf")
    doc2.set_metadata({
        "producer": "Adobe Photoshop CC 2025 / iLovePDF",
        "creator": "Canva PDF Editor",
        "creationDate": "D:20260901100000+05'30'",
        "modDate": "D:20261002143000+05'30'"  # Modified after creation!
    })
    doc2.save("2_forged_metadata_photoshop_deed.pdf")
    doc2.close()

    # 3. WRONG SURVEY NUMBER / OWNER MISMATCH (Fails Layer 4 Content Check -> Risk Score: 60)
    doc3 = pymupdf.open()
    page3 = doc3.new_page()
    text3 = (
        "ABSOLUTE SALE DEED OF IMMOVABLE PROPERTY\n\n"
        "Survey Number: SURVEY-MUMBAI-999/Z\n"
        "Registered Owner (Vendor): Fake Impersonator Name\n"
        "This deed belongs to a completely different plot of land."
    )
    page3.insert_text((50, 70), text3, fontsize=11)
    doc3.set_metadata({
        "producer": "NIC e-Registration Portal v4.2",
        "creator": "IGR Maharashtra Official Scanner"
    })
    doc3.save("3_mismatched_survey_owner_deed.pdf")
    doc3.close()

    # 4. 1-BYTE TAMPERED DEED (For testing /tamper-check Keccak-256 Avalanche Effect)
    doc4 = pymupdf.open()
    page4 = doc4.new_page()
    # Notice Consideration Amount changed from 1,45,00,000 to 9,45,00,000 (1 digit altered!)
    text4 = text1.replace("1,45,00,000", "9,45,00,000")
    page4.insert_text((50, 70), text4, fontsize=11)
    doc4.set_metadata({
        "producer": "NIC e-Registration Portal v4.2",
        "creator": "IGR Maharashtra Official Scanner",
        "creationDate": "D:20261002100000+05'30'",
        "modDate": "D:20261002100000+05'30'"
    })
    doc4.save("4_tampered_amount_1byte_deed.pdf")
    doc4.close()

    print("Generated 4 test PDFs successfully!")

if __name__ == "__main__":
    create_test_suite()