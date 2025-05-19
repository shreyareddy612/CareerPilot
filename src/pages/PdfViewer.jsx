import React, { useState } from 'react';
import PdfViewer from '../components/PdfViewer'
import {Button} from 'antd';
import Layout from '../components/Layout';

  


export default function PdfViewerButton(
  {resumeurl}
){


  const [showPdf, setShowPdf] = useState(false)

  return(
    <>
    <PdfViewer pdf={resumeurl}
                 onCancel={()=>setShowPdf(false)}
                 visible={showPdf}
      />
      <Button type='primary' shape='round' onClick={()=>setShowPdf(!showPdf)}>View Resume</Button>
    </>
  )
}
