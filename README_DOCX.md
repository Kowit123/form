# Word Document Generator for Travel Approval Form

This project provides a Word document (.docx) generator similar to the existing PDF generator for travel approval forms in Thai government institutions.

## Features

- **Word Document Generation**: Creates professional .docx files using the docx library
- **Thai Language Support**: Properly handles Thai text formatting
- **Form Data Integration**: Uses the same form data as the PDF generator
- **Multiple Pages**: Supports additional pages for participants list and personal car approval
- **Professional Formatting**: Includes proper headers, sections, and signatures

## Files

- `docx_generator.js` - Main Word document generation function
- `docx_demo.html` - Demo page showing how to use the generator
- `README_DOCX.md` - This documentation file

## Setup

### 1. Include Required Libraries

Add the docx library to your HTML file:

```html
<script src="https://unpkg.com/docx@8.2.3/build/index.js"></script>
```

### 2. Include the Generator Script

```html
<script src="docx_generator.js"></script>
```

### 3. Call the Function

```javascript
// Generate Word document
generateDOCX();
```

## Usage

### Basic Usage

```javascript
// Simple call to generate Word document
generateDOCX();
```

### Integration with Existing Form

The function automatically reads form data from the same HTML elements used by the PDF generator:

- `agency` - Government agency name
- `bookNum` - Document number
- `thai-datepicker1` - Document date
- `topic` - Document topic
- `dear` - Recipient
- `requesting_name` - Requester name
- `requesting_position` - Requester position
- `requesting_part` - Requester department
- And many more...

### Form Structure

The generator expects the same form structure as the PDF version:

```html
<input type="text" id="agency" value="คณะวิศวกรรมศาสตร์ มหาวิทยาลัยมหาสารคาม">
<input type="text" id="requesting_name" value="นายสมชาย ใจดี">
<!-- ... other form fields ... -->
```

## Document Structure

The generated Word document includes:

### Main Page
1. **Header**: "บันทึกข้อความ" (Document Record)
2. **Agency Information**: Government agency details
3. **Document Details**: Number, date, topic, recipient
4. **Main Content**: Travel request with purpose and dates
5. **Cost Breakdown**:
   - Allowance costs
   - Accommodation costs
   - Transportation costs
   - Registration fees
   - Other expenses
6. **Total Cost**: Sum with Thai text representation
7. **Signature Section**: Requester signature and details
8. **Approval Section**: Multiple approval levels with signature lines

### Additional Pages (Conditional)

#### Participants List Page
- Generated when `entryCount1 > 1`
- Table with participant names, positions, and departments

#### Personal Car Approval Page
- Generated when personal car checkbox is checked
- Separate approval document for personal vehicle use

## Key Features

### Thai Number Conversion
```javascript
function numberToThaiText(number) {
    // Converts numbers to Thai text (e.g., 1000 -> "หนึ่งพันบาทถ้วน")
}
```

### Conditional Content
- Participants table only appears when there are multiple participants
- Personal car approval page only appears when personal car is selected
- Dynamic content based on form selections

### Professional Formatting
- Proper page margins and sizing (A4)
- Consistent font sizes and spacing
- Right-aligned cost totals
- Centered signatures
- Bold headers and labels

## Browser Compatibility

- Modern browsers with ES6+ support
- Requires internet connection for CDN libraries
- Works with the same form data as the PDF generator

## Dependencies

- **docx library**: For Word document generation
- **Form data**: Same structure as PDF generator
- **Thai fonts**: Uses system Thai fonts

## Example Output

The generated document will be a professional Word file with:
- Proper Thai formatting
- Government document structure
- Cost calculations
- Signature sections
- Approval workflow

## Integration Tips

1. **Use the same form IDs**: The Word generator uses the same element IDs as the PDF generator
2. **Global variables**: Set global variables like `window.accommodationTotal` for cost calculations
3. **Event handling**: The generator can be called from button clicks or form submissions
4. **Error handling**: Add try-catch blocks for production use

## Troubleshooting

### Common Issues

1. **Library not loaded**: Ensure the docx library is included before calling the function
2. **Form data missing**: Check that all required form elements exist
3. **Thai text issues**: Ensure proper UTF-8 encoding
4. **Download not working**: Check browser download settings

### Debug Tips

```javascript
// Add console logging for debugging
console.log('Form data:', {
    agency: document.getElementById("agency").value,
    requesting_name: document.getElementById("requesting_name").value,
    // ... other fields
});
```

## Future Enhancements

- Add custom fonts support
- Include company logos
- Add more document templates
- Support for different paper sizes
- Enhanced table formatting
- Custom styling options 