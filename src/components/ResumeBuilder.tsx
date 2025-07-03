'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import Link from 'next/link';
import { 
  ArrowLeft, 
  FileText, 
  Download, 
  Upload, 
  Sparkles, 
  Eye, 
  EyeOff,
  Plus,
  Minus,
  RotateCcw,
  Trash2,
  TestTube,
  AlertCircle,
  CheckCircle,
  Loader2,
  User,
  Phone,
  Mail,
  Linkedin,
  Github,
  GraduationCap,
  Briefcase,
  Code,
  Award,
  Star
} from 'lucide-react';

interface Contact {
  phone: string;
  email: string;
  linkedin: string;
  github: string;
}

interface TechnicalSkill {
  category: string;
  skills: string;
}

interface Education {
  institution: string;
  location: string;
  degree: string;
  dates: string;
}

interface Experience {
  title: string;
  company: string;
  location: string;
  dates: string;
  duties: string[];
}

interface Project {
  name: string;
  technologies: string;
  description: string[];
}

interface Certification {
  name: string;
  issuer: string;
}

interface ExtracurricularActivity {
  title: string;
  date: string;
  description: string[];
}

interface ResumeData {
  name: string;
  contact: Contact;
  summary: string;
  technical_skills: TechnicalSkill[];
  education: Education[];
  experience: Experience[];
  projects: Project[];
  certifications: Certification[];
  extracurricular: ExtracurricularActivity[];
  other: string;
}

const blankTemplate: ResumeData = {
  name: '',
  contact: { phone: '', email: '', linkedin: '', github: '' },
  summary: '',
  technical_skills: [
    { category: 'Languages', skills: '' },
  ],
  education: [{ institution: '', location: '', degree: '', dates: '' }],
  experience: [
    {
      title: '',
      company: '',
      location: '',
      dates: '',
      duties: [''],
    },
  ],
  projects: [{ name: '', technologies: '', description: [''] }],
  certifications: [{ name: '', issuer: '' }],
  extracurricular: [{ title: '', date: '', description: [''] }],
  other: '',
};

export default function ResumeBuilder() {
  const [resumeData, setResumeData] = useState<ResumeData>(blankTemplate);
  const [geminiApiKey, setGeminiApiKey] = useState<string>('');
  const [isApiKeyValid, setIsApiKeyValid] = useState<boolean>(false);
  const [showApiKey, setShowApiKey] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [apiStatus, setApiStatus] = useState<'success' | 'error' | 'testing' | 'unknown'>('unknown');
  const [apiStatusMessage, setApiStatusMessage] = useState<string>('Not tested');
  const [isTestingApi, setIsTestingApi] = useState<boolean>(false);
  const [importedResumeData, setImportedResumeData] = useState<ResumeData | null>(null);
  
  // AI dialog states
  const [showExperienceAIDialog, setShowExperienceAIDialog] = useState<boolean>(false);
  const [showProjectAIDialog, setShowProjectAIDialog] = useState<boolean>(false);
  const [showSkillsAIDialog, setShowSkillsAIDialog] = useState<boolean>(false);
  const [aiRawText, setAiRawText] = useState<string>('');
  const [aiBulletCount, setAiBulletCount] = useState<number>(3);

  // Predefined skill categories
  const skillCategories = [
    'Languages',
    'Programming Languages',
    'Web Technologies',
    'Frameworks & Libraries',
    'Databases',
    'Cloud & DevOps',
    'Mobile Development',
    'Data Science & AI',
    'Software & Tools',
    'Operating Systems',
    'Design & UI/UX',
    'Game Development',
    'Cybersecurity',
    'Networking',
    'Testing & QA',
    'Certifications',
    'Soft Skills',
    'Hardware & Embedded',
    'Blockchain & Web3',
    'Analytics & Business Intelligence'
  ];

  // Load API key from localStorage on component mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem('geminiApiKey');
    if (savedApiKey) {
      setGeminiApiKey(savedApiKey);
      testApiKey(savedApiKey, false);
    }
  }, []);

  const saveApiKey = (apiKey: string) => {
    if (apiKey && apiKey.trim()) {
      localStorage.setItem('geminiApiKey', apiKey.trim());
      setGeminiApiKey(apiKey.trim());
    } else {
      localStorage.removeItem('geminiApiKey');
      setGeminiApiKey('');
    }
  };

  const testApiKey = async (apiKey: string, showUserFeedback: boolean = true) => {
    if (!apiKey || !apiKey.trim()) {
      setApiStatus('error');
      setApiStatusMessage('API key required');
      setIsApiKeyValid(false);
      return false;
    }

    if (showUserFeedback) {
      setIsTestingApi(true);
      setApiStatus('testing');
      setApiStatusMessage('Testing...');
    }

    try {
      const testPrompt = "Say 'API test successful' and nothing else.";
      const response = await callGeminiAPI(testPrompt, apiKey);

      if (response && response.toLowerCase().includes('api test successful')) {
        setApiStatus('success');
        setApiStatusMessage('API key valid');
        setIsApiKeyValid(true);
        saveApiKey(apiKey);
        if (showUserFeedback) {
          alert('API key is valid and working!');
        }
        return true;
      } else {
        throw new Error('Unexpected API response');
      }
    } catch (error: any) {
      console.error('API test failed:', error);
      let errorMessage = 'Invalid or expired';

      if (error.message.includes('API key')) {
        errorMessage = 'Invalid API key';
      } else if (error.message.includes('quota') || error.message.includes('rate limit')) {
        errorMessage = 'Quota exceeded';
      } else if (error.message.includes('network')) {
        errorMessage = 'Network error';
      } else if (error.message.includes('401')) {
        errorMessage = 'Unauthorized';
      } else if (error.message.includes('403')) {
        errorMessage = 'Access forbidden';
      }

      setApiStatus('error');
      setApiStatusMessage(errorMessage);
      setIsApiKeyValid(false);

      if (showUserFeedback) {
        alert(`API key test failed: ${errorMessage}`);
      }
      return false;
    } finally {
      setIsTestingApi(false);
    }
  };

  const callGeminiAPI = async (prompt: string, apiKeyOverride?: string): Promise<string> => {
    if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
      throw new Error('Invalid prompt provided');
    }

    const apiKey = apiKeyOverride || geminiApiKey;
    if (!apiKey || apiKey.trim() === '') {
      throw new Error('API key is required');
    }

    const chatHistory = [{ role: 'user', parts: [{ text: prompt }] }];
    const payload = { contents: chatHistory };

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let errorMessage = `API request failed with status ${response.status}`;
        
        if (response.status === 401) {
          errorMessage = 'API key is invalid or expired';
        } else if (response.status === 403) {
          errorMessage = 'API access forbidden. Check your API key permissions';
        } else if (response.status === 429) {
          errorMessage = 'API quota exceeded or rate limit reached';
        } else if (response.status >= 500) {
          errorMessage = 'API server error. Please try again later';
        }

        throw new Error(errorMessage);
      }

      const result = await response.json();

      if (!result?.candidates?.[0]?.content?.parts?.[0]?.text) {
        throw new Error('Invalid response structure from API');
      }

      return result.candidates[0].content.parts[0].text.trim();
    } catch (error: any) {
      console.error('API call failed:', error);
      throw error;
    }
  };

  const rewriteText = async (text: string, instruction: string) => {
    if (!isApiKeyValid) {
      throw new Error('Please set up and test a valid API key first.');
    }

    const finalInstruction = instruction || 'make it more professional and impactful';
    const prompt = `Your task is to rewrite the following resume text.
Original text: "${text}"
Apply this instruction: "${finalInstruction}"
IMPORTANT: Your response MUST ONLY be the rewritten text. Do not add any introductory phrases, explanations, or formatting.`;

    return await callGeminiAPI(prompt);
  };

  const generateBulletPoint = async (context: any, instruction: string) => {
    if (!isApiKeyValid) {
      throw new Error('Please set up and test a valid API key first.');
    }

    const finalInstruction = instruction || 'Generate one new, impactful bullet point that complements the existing points.';
    const prompt = `Based on the following resume entry context, generate a new bullet point.
Context:
${JSON.stringify(context, null, 2)}

Instruction for the new bullet point: "${finalInstruction}"

IMPORTANT: Your response MUST ONLY be the new bullet point text. Do not add any introductory phrases, explanations, or formatting like bullet characters.`;

    return await callGeminiAPI(prompt);
  };

  const updateData = (path: string, value: any) => {
    const keys = path.replace(/\[(\d+)\]/g, '.$1').split('.');
    const newData = JSON.parse(JSON.stringify(resumeData));
    let obj = newData;

    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!obj[key]) {
        obj[key] = {};
      }
      obj = obj[key];
    }

    obj[keys[keys.length - 1]] = value;
    setResumeData(newData);
  };

  // Technical Skills Management
  const addSkillCategory = () => {
    if (resumeData.technical_skills.length >= 4) {
      alert('Maximum of 4 skill categories allowed.');
      return;
    }
    
    // Find a good default category that hasn't been used yet
    const usedCategories = resumeData.technical_skills.map(skill => skill.category);
    const availableCategories = skillCategories.filter(cat => !usedCategories.includes(cat));
    const defaultCategory = availableCategories.length > 0 ? availableCategories[0] : '';
    
    const newCategory = { category: defaultCategory, skills: '' };
    setResumeData({
      ...resumeData,
      technical_skills: [...resumeData.technical_skills, newCategory]
    });
  };

  const removeSkillCategory = (index: number) => {
    if (resumeData.technical_skills.length <= 1) {
      alert('At least one skill category is required.');
      return;
    }
    
    // Don't allow removing the Languages category if it's the first one
    if (index === 0 && resumeData.technical_skills[0].category === 'Languages') {
      alert('The Languages category cannot be removed. You can edit its name if needed.');
      return;
    }
    
    const newSkills = resumeData.technical_skills.filter((_, i) => i !== index);
    setResumeData({
      ...resumeData,
      technical_skills: newSkills
    });
  };

  const updateSkillCategory = (index: number, newCategory: string) => {
    const newSkills = [...resumeData.technical_skills];
    newSkills[index] = { ...newSkills[index], category: newCategory };
    setResumeData({
      ...resumeData,
      technical_skills: newSkills
    });
  };

  // Normalize imported resume data to ensure all fields are valid
  const normalizeResumeData = (data: any): ResumeData => {
    const normalized = { ...blankTemplate };
    
    if (data && typeof data === 'object') {
      // Copy basic fields
      normalized.name = data.name || '';
      normalized.summary = data.summary || '';
      normalized.other = data.other || '';
      
      // Normalize contact
      if (data.contact) {
        normalized.contact = {
          phone: data.contact.phone || '',
          email: data.contact.email || '',
          linkedin: data.contact.linkedin || '',
          github: data.contact.github || ''
        };
      }
      
      // Normalize technical skills
      if (data.technical_skills && Array.isArray(data.technical_skills)) {
        normalized.technical_skills = data.technical_skills.map((skill: any) => ({
          category: skill.category || '',
          skills: skill.skills || ''
        }));
      }
      
      // Normalize education
      if (data.education && Array.isArray(data.education)) {
        normalized.education = data.education.map((edu: any) => ({
          institution: edu.institution || '',
          location: edu.location || '',
          degree: edu.degree || '',
          dates: edu.dates || ''
        }));
      }
      
      // Normalize experience
      if (data.experience && Array.isArray(data.experience)) {
        normalized.experience = data.experience.map((exp: any) => ({
          title: exp.title || '',
          company: exp.company || '',
          location: exp.location || '',
          dates: exp.dates || '',
          duties: Array.isArray(exp.duties) ? exp.duties : ['']
        }));
      }
      
      // Normalize projects
      if (data.projects && Array.isArray(data.projects)) {
        normalized.projects = data.projects.map((proj: any) => ({
          name: proj.name || '',
          technologies: proj.technologies || '',
          description: Array.isArray(proj.description) ? proj.description : ['']
        }));
      }
      
      // Normalize certifications
      if (data.certifications && Array.isArray(data.certifications)) {
        normalized.certifications = data.certifications.map((cert: any) => ({
          name: cert.name || '',
          issuer: cert.issuer || ''
        }));
      }
      
      // Normalize extracurricular
      if (data.extracurricular && Array.isArray(data.extracurricular)) {
        normalized.extracurricular = data.extracurricular.map((extra: any) => ({
          title: extra.title || '',
          date: extra.date || '',
          description: Array.isArray(extra.description) ? extra.description : ['']
        }));
      }
    }
    
    return normalized;
  };
  
  const resetToBlank = () => {
    if (confirm('Are you sure you want to reset to a blank template? This action cannot be undone.')) {
      setResumeData(JSON.parse(JSON.stringify(blankTemplate)));
    }
  };

  const resetToOriginal = () => {
    if (importedResumeData) {
      if (confirm('Are you sure you want to reset to the original imported resume? This action cannot be undone.')) {
        setResumeData(JSON.parse(JSON.stringify(importedResumeData)));
      }
    } else {
      alert('No original resume data to restore. Please import a resume first.');
    }
  };

  const importFromJSON = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const jsonData = JSON.parse(e.target?.result as string);
            // Validate the JSON structure
            if (jsonData && typeof jsonData === 'object') {
              const normalizedData = normalizeResumeData(jsonData);
              setResumeData(normalizedData);
              setImportedResumeData(normalizedData);
              alert('Resume imported successfully!');
            } else {
              alert('Invalid JSON format. Please ensure the file contains valid resume data.');
            }
          } catch (error) {
            alert('Error parsing JSON file. Please check the file format.');
            console.error('JSON import error:', error);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const parseLatexWithAI = async (latexText: string) => {
    if (!isApiKeyValid) {
      throw new Error('Please set up and test a valid API key first.');
    }

    const prompt = `You are an expert resume parsing assistant. Your task is to convert the following LaTeX resume into a clean JSON object. Use the following JSON object as a schema and guide for the field names.

- Identify sections like "Summary", "Experience", "Projects", "Education", etc.
- For "Experience" and "Projects", each entry should be an object with a title/name and a list of bullet points in the 'duties' or 'description' array.
- Populate the JSON fields with the corresponding text you find.
- If you find text that does not fit into any of the predefined categories, place it in the 'other' field.
- Do not invent any information. Only use the text provided.
- Ensure the final output is a single, valid JSON object and nothing else.

## Schema and Example Structure:
${JSON.stringify(blankTemplate, null, 2)}

## LaTeX Text to Parse:
${latexText}

IMPORTANT: Your response MUST be ONLY valid JSON. Do not include any explanations, markdown formatting, or other text.`;

    try {
      const resultText = await callGeminiAPI(prompt);
      
      if (!resultText || typeof resultText !== 'string') {
        throw new Error('Invalid API response: empty or non-string result');
      }

      // Clean the result to ensure it's valid JSON
      const cleanedJsonString = resultText
        .replace(/```json|```/g, '')
        .trim();

      if (!cleanedJsonString) {
        throw new Error('Empty JSON string after cleaning');
      }

      let parsedResult;
      try {
        parsedResult = JSON.parse(cleanedJsonString);
      } catch (jsonError) {
        console.error('JSON Parse Error:', jsonError);
        console.error('Raw response:', resultText);
        console.error('Cleaned string:', cleanedJsonString);
        throw new Error(`Failed to parse JSON response: ${jsonError instanceof Error ? jsonError.message : 'Unknown error'}`);
      }

      return normalizeResumeData(parsedResult);
    } catch (error) {
      console.error('AI parsing failed:', error);
      
      // Provide more specific error messages
      if (error instanceof Error) {
        if (error.message.includes('API key')) {
          throw new Error('API key is missing or invalid. Please check your configuration.');
        } else if (error.message.includes('quota')) {
          throw new Error('API quota exceeded. Please try again later.');
        } else if (error.message.includes('network')) {
          throw new Error('Network error. Please check your internet connection.');
        } else {
          throw new Error(`AI processing failed: ${error.message}`);
        }
      } else {
        throw new Error('An unknown error occurred during AI processing.');
      }
    }
  };

  const parseResumeTextWithAI = async (text: string, sourceType: 'PDF' | 'LaTeX' = 'PDF') => {
    if (!isApiKeyValid) {
      throw new Error('Please set up and test a valid API key first.');
    }

    const prompt = `You are an expert resume parsing assistant. Your task is to convert the following resume text (extracted from a ${sourceType}) into a clean JSON object. Use the following JSON object as a schema and guide for the field names.

- Identify sections like "Summary", "Experience", "Projects", "Education", etc.
- For "Experience" and "Projects", each entry should be an object with a title/name and a list of bullet points in the 'duties' or 'description' array.
- Populate the JSON fields with the corresponding text you find.
- If you find text that does not fit into any of the predefined categories, place it in the 'other' field.
- Do not invent any information. Only use the text provided.
- Clean up any formatting artifacts from the ${sourceType} extraction.
- Ensure the final output is a single, valid JSON object and nothing else.

## Schema and Example Structure:
${JSON.stringify(blankTemplate, null, 2)}

## Resume Text to Parse:
${text}

IMPORTANT: Your response MUST be ONLY valid JSON. Do not include any explanations, markdown formatting, or other text.`;

    try {
      const resultText = await callGeminiAPI(prompt);
      
      if (!resultText || typeof resultText !== 'string') {
        throw new Error('Invalid API response: empty or non-string result');
      }

      // Clean the result to ensure it's valid JSON
      const cleanedJsonString = resultText
        .replace(/```json|```/g, '')
        .trim();

      if (!cleanedJsonString) {
        throw new Error('Empty JSON string after cleaning');
      }

      let parsedResult;
      try {
        parsedResult = JSON.parse(cleanedJsonString);
      } catch (jsonError) {
        console.error('JSON Parse Error:', jsonError);
        console.error('Raw response:', resultText);
        console.error('Cleaned string:', cleanedJsonString);
        throw new Error(`Failed to parse JSON response: ${jsonError instanceof Error ? jsonError.message : 'Unknown error'}`);
      }

      return normalizeResumeData(parsedResult);
    } catch (error) {
      console.error('AI parsing failed:', error);
      
      // Provide more specific error messages
      if (error instanceof Error) {
        if (error.message.includes('API key')) {
          throw new Error('API key is missing or invalid. Please check your configuration.');
        } else if (error.message.includes('quota')) {
          throw new Error('AI quota exceeded. Please try again later.');
        } else if (error.message.includes('network')) {
          throw new Error('Network error. Please check your internet connection.');
        } else {
          throw new Error(`AI processing failed: ${error.message}`);
        }
      } else {
        throw new Error('An unknown error occurred during AI processing.');
      }
    }
  };

  const importFromLaTeX = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.tex,.txt';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            const latexText = e.target?.result as string;
            
            if (!isApiKeyValid) {
              alert('AI parsing requires a valid API key. Please configure your Gemini API key first.');
              return;
            }

            setIsLoading(true);
            setLoadingMessage('AI is parsing your LaTeX resume...');

            const parsedData = await parseLatexWithAI(latexText);
            
            if (parsedData && typeof parsedData === 'object') {
              setResumeData(parsedData);
              setImportedResumeData(parsedData);
              alert('LaTeX resume imported and parsed successfully!');
            } else {
              throw new Error('AI returned invalid data structure');
            }
          } catch (error: any) {
            console.error('LaTeX import error:', error);
            alert(`Error importing LaTeX file: ${error.message}`);
          } finally {
            setIsLoading(false);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const importFromPDF = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        if (!isApiKeyValid) {
          alert('AI parsing requires a valid API key. Please configure your Gemini API key first.');
          return;
        }

        setIsLoading(true);
        setLoadingMessage('Extracting text from PDF...');

        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            const arrayBuffer = e.target?.result as ArrayBuffer;
            
            // Import pdfjs-dist dynamically for client-side usage
            const pdfjsLib = await import('pdfjs-dist');
            
            // Set worker source
            pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
            
            setLoadingMessage('Processing PDF...');
            
            // Load the PDF document
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            let extractedText = '';
            
            setLoadingMessage(`Extracting text from ${pdf.numPages} pages...`);
            
            // Extract text from all pages
            for (let i = 1; i <= pdf.numPages; i++) {
              const page = await pdf.getPage(i);
              const textContent = await page.getTextContent();
              const pageText = textContent.items
                .map((item: any) => item.str)
                .join(' ');
              extractedText += pageText + '\n';
            }
            
            if (!extractedText || extractedText.trim().length === 0) {
              throw new Error('No text could be extracted from the PDF. Please ensure the PDF contains selectable text.');
            }

            setLoadingMessage('AI is parsing your PDF resume...');
            
            // Use AI to parse the extracted text
            const parsedData = await parseResumeTextWithAI(extractedText, 'PDF');
            
            if (parsedData && typeof parsedData === 'object') {
              setResumeData(parsedData);
              setImportedResumeData(parsedData);
              alert('PDF resume imported and parsed successfully!');
            } else {
              throw new Error('AI returned invalid data structure');
            }
          } catch (error: any) {
            console.error('PDF import error:', error);
            let errorMessage = 'Error importing PDF file: ';
            
            if (error.message.includes('No text could be extracted')) {
              errorMessage += 'This PDF appears to be an image or scanned document. Please use a PDF with selectable text or try a different format.';
            } else if (error.message.includes('API key')) {
              errorMessage += 'Please configure your Gemini API key first.';
            } else if (error.message.includes('Loading')) {
              errorMessage += 'Failed to load the PDF file. Please ensure the file is not corrupted.';
            } else {
              errorMessage += error.message;
            }
            
            alert(errorMessage);
          } finally {
            setIsLoading(false);
          }
        };
        reader.readAsArrayBuffer(file);
      }
    };
    input.click();
  };

  const exportToJSON = () => {
    const jsonString = JSON.stringify(resumeData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'resume.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportToLaTeX = () => {
    const latex = generateLaTeX(resumeData);
    const blob = new Blob([latex], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'resume.tex';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generateLaTeX = (data: ResumeData): string => {
    const escapeLatex = (text: string) => {
      if (typeof text !== 'string') return '';
      return text
        .replace(/&/g, '\\&')
        .replace(/%/g, '\\%')
        .replace(/\$/g, '\\$')
        .replace(/#/g, '\\#')
        .replace(/_/g, '\\_')
        .replace(/{/g, '\\{')
        .replace(/}/g, '\\}')
        .replace(/~/g, '\\textasciitilde{}')
        .replace(/\^/g, '\\textasciicircum{}')
        .replace(/\\/g, '\\textbackslash{}');
    };

    // Basic LaTeX template - simplified version
    return `\\documentclass[letterpaper,11pt]{article}
\\usepackage[margin=1in]{geometry}
\\usepackage{enumitem}
\\usepackage{hyperref}

\\begin{document}

\\begin{center}
\\textbf{\\Large ${escapeLatex(data.name)}} \\\\
\\small ${escapeLatex(data.contact.phone)} | ${escapeLatex(data.contact.email)} | ${escapeLatex(data.contact.linkedin)} | ${escapeLatex(data.contact.github)}
\\end{center}

\\section*{Summary}
${escapeLatex(data.summary)}

\\section*{Technical Skills}
\\begin{itemize}[noitemsep]
${data.technical_skills.map(skill => 
  `\\item \\textbf{${escapeLatex(skill.category)}:} ${escapeLatex(skill.skills)}`
).join('\n')}
\\end{itemize}

\\section*{Education}
${data.education.map(edu => 
  `\\textbf{${escapeLatex(edu.institution)}} \\hfill ${escapeLatex(edu.dates)} \\\\
\\textit{${escapeLatex(edu.degree)}} \\hfill ${escapeLatex(edu.location)}`
).join('\n\n')}

\\section*{Experience}
${data.experience.map(exp => 
  `\\textbf{${escapeLatex(exp.title)}} \\hfill ${escapeLatex(exp.dates)} \\\\
\\textit{${escapeLatex(exp.company)}} \\hfill ${escapeLatex(exp.location)} \\\\
\\begin{itemize}[noitemsep]
${exp.duties.map(duty => `\\item ${escapeLatex(duty)}`).join('\n')}
\\end{itemize}`
).join('\n\n')}

\\section*{Projects}
${data.projects.map(proj => 
  `\\textbf{${escapeLatex(proj.name)}} | \\textit{${escapeLatex(proj.technologies)}} \\\\
\\begin{itemize}[noitemsep]
${proj.description.map(desc => `\\item ${escapeLatex(desc)}`).join('\n')}
\\end{itemize}`
).join('\n\n')}

\\end{document}`;
  };

  // AI extraction functions
  const extractExperienceWithAI = async (rawText: string, bulletCount: number) => {
    if (!isApiKeyValid) {
      alert('Please enter a valid API key in the settings to use AI features.');
      return null;
    }

    const prompt = `You are an expert professional resume writer. Extract and format a single work experience from the following raw text.

Your task:
1. Extract the job title, company name, location, and dates
2. Generate exactly ${bulletCount} professional bullet points that highlight achievements, responsibilities, and impact
3. Each bullet point should be action-oriented, quantified when possible, and showcase value delivered
4. Use strong action verbs and focus on results and accomplishments
5. Return ONLY valid JSON in this exact format:

{
  "title": "Job Title",
  "company": "Company Name", 
  "location": "City, State",
  "dates": "Start Date - End Date",
  "duties": [
    "First bullet point with quantified achievement",
    "Second bullet point showcasing impact",
    "Additional bullet points as requested..."
  ]
}

Raw text to process:
${rawText}

IMPORTANT: Return ONLY the JSON object, no explanations or additional text.`;

    try {
      setIsLoading(true);
      setLoadingMessage('Extracting experience data with AI...');
      
      const result = await callGeminiAPI(prompt);
      const cleanedResult = result.replace(/```json\n?|\n?```/g, '').trim();
      const experienceData = JSON.parse(cleanedResult);
      
      setIsLoading(false);
      return experienceData;
    } catch (error) {
      setIsLoading(false);
      console.error('Error extracting experience:', error);
      alert('Error extracting experience. Please check the text format and try again.');
      return null;
    }
  };

  const extractProjectWithAI = async (rawText: string, bulletCount: number) => {
    if (!isApiKeyValid) {
      alert('Please enter a valid API key in the settings to use AI features.');
      return null;
    }

    const prompt = `You are an expert professional resume writer. Extract and format a single project from the following raw text.

Your task:
1. Extract the project name and technologies used
2. Generate exactly ${bulletCount} professional bullet points that highlight technical achievements, features implemented, and impact
3. Each bullet point should showcase technical skills, problem-solving abilities, and project outcomes
4. Focus on specific technologies, methodologies, and measurable results
5. Return ONLY valid JSON in this exact format:

{
  "name": "Project Name",
  "technologies": "Technology1, Technology2, Technology3",
  "description": [
    "First bullet point highlighting key technical achievement",
    "Second bullet point showcasing implementation details",
    "Additional bullet points as requested..."
  ]
}

Raw text to process:
${rawText}

IMPORTANT: Return ONLY the JSON object, no explanations or additional text.`;

    try {
      setIsLoading(true);
      setLoadingMessage('Extracting project data with AI...');
      
      const result = await callGeminiAPI(prompt);
      const cleanedResult = result.replace(/```json\n?|\n?```/g, '').trim();
      const projectData = JSON.parse(cleanedResult);
      
      setIsLoading(false);
      return projectData;
    } catch (error) {
      setIsLoading(false);
      console.error('Error extracting project:', error);
      alert('Error extracting project. Please check the text format and try again.');
      return null;
    }
  };

  const extractTechnicalSkillsWithAI = async (rawText: string) => {
    if (!isApiKeyValid) {
      alert('Please enter a valid API key in the settings to use AI features.');
      return null;
    }

    // Get current skill categories for context
    const currentCategories = resumeData.technical_skills.map(skill => skill.category).filter(cat => cat.trim() !== '');
    const categoriesContext = currentCategories.length > 0 
      ? `Current categories: ${currentCategories.join(', ')}`
      : 'No current categories defined';

    const prompt = `You are an expert professional resume writer. Extract, organize, and consolidate technical skills from the provided text.

Your task:
1. Parse ALL technical skills, programming languages, frameworks, tools, and technologies mentioned
2. If existing categorized skills are present, merge them intelligently with any new skills found
3. Organize skills into logical categories - suggest 2-4 categories maximum
4. Always include a "Languages" category if any programming languages are found
5. Common categories: Languages, Frameworks, Databases, Tools, Cloud Services, DevOps, etc.
6. Remove duplicates and consolidate similar items
7. Keep skills concise - list only the skill names separated by commas
8. Do NOT add explanatory text, filler words, or phrases like "including but not limited to"
9. Return ONLY valid JSON in this exact format:

[
  {
    "category": "Languages",
    "skills": "JavaScript, Python, Java, C++"
  },
  {
    "category": "Frameworks & Libraries", 
    "skills": "React, Node.js, Express, Django"
  },
  {
    "category": "Databases & Storage",
    "skills": "MySQL, PostgreSQL, MongoDB"
  }
]

Context: ${categoriesContext}

Text to process (may contain existing categorized skills and/or new skills to add):
${rawText}

IMPORTANT: Return ONLY the JSON array. No explanations, no markdown formatting, no additional text.`;

    try {
      setIsLoading(true);
      setLoadingMessage('Processing and organizing technical skills with AI...');
      
      const result = await callGeminiAPI(prompt);
      const cleanedResult = result.replace(/```json\n?|\n?```/g, '').trim();
      const skillsData = JSON.parse(cleanedResult);
      
      setIsLoading(false);
      return skillsData;
    } catch (error) {
      setIsLoading(false);
      console.error('Error extracting skills:', error);
      alert('Error extracting technical skills. Please check the text format and try again.');
      return null;
    }
  };

  const EditableField = ({ 
    value, 
    path, 
    isTextarea = false, 
    placeholder = '', 
    withAI = true,
    icon: Icon
  }: {
    value: string;
    path: string;
    isTextarea?: boolean;
    placeholder?: string;
    withAI?: boolean;
    icon?: any;
  }) => {
    const [localValue, setLocalValue] = useState(value);
    const [instruction, setInstruction] = useState('');
    const [isRewriting, setIsRewriting] = useState(false);

    useEffect(() => {
      setLocalValue(value);
    }, [value]);

    const handleBlur = () => {
      updateData(path, localValue);
    };

    const handleRewrite = async () => {
      if (!localValue.trim()) {
        alert('Please enter some text to rewrite.');
        return;
      }

      setIsRewriting(true);
      setLoadingMessage('AI is rewriting...');
      setIsLoading(true);

      try {
        const rewrittenText = await rewriteText(localValue, instruction);
        if (rewrittenText && rewrittenText.trim()) {
          setLocalValue(rewrittenText);
          updateData(path, rewrittenText);
          setInstruction('');
        }
      } catch (error: any) {
        console.error('Error rewriting text:', error);
        alert(`Failed to rewrite text: ${error.message}`);
      } finally {
        setIsRewriting(false);
        setIsLoading(false);
      }
    };

    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="w-4 h-4 text-muted-foreground" />}
          <div className="flex-1">
            {isTextarea ? (
              <Textarea
                value={localValue}
                onChange={(e) => setLocalValue(e.target.value)}
                onBlur={handleBlur}
                placeholder={placeholder}
                className="min-h-[80px] resize-none"
                rows={3}
              />
            ) : (
              <Input
                value={localValue}
                onChange={(e) => setLocalValue(e.target.value)}
                onBlur={handleBlur}
                placeholder={placeholder}
              />
            )}
          </div>
        </div>
        
        {withAI && (
          <div className="flex gap-2">
            <Input
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              placeholder="e.g., make it more concise, use stronger verbs"
              className="flex-1 text-sm"
            />
            <Button
              onClick={handleRewrite}
              disabled={isRewriting || !isApiKeyValid}
              size="sm"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              {isRewriting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
            </Button>
          </div>
        )}
      </div>
    );
  };

  // AI dialog handlers
  const handleExperienceAI = async () => {
    if (!aiRawText.trim()) {
      alert('Please enter some text to extract experience from.');
      return;
    }

    const extractedData = await extractExperienceWithAI(aiRawText, aiBulletCount);
    if (extractedData) {
      const newExperience = [...resumeData.experience, extractedData];
      setResumeData({ ...resumeData, experience: newExperience });
      setShowExperienceAIDialog(false);
      setAiRawText('');
      setAiBulletCount(3);
    }
  };

  const handleProjectAI = async () => {
    if (!aiRawText.trim()) {
      alert('Please enter some text to extract project from.');
      return;
    }

    const extractedData = await extractProjectWithAI(aiRawText, aiBulletCount);
    if (extractedData) {
      const newProjects = [...resumeData.projects, extractedData];
      setResumeData({ ...resumeData, projects: newProjects });
      setShowProjectAIDialog(false);
      setAiRawText('');
      setAiBulletCount(3);
    }
  };

  const handleSkillsAI = async () => {
    if (!aiRawText.trim()) {
      alert('Please enter some text to extract skills from.');
      return;
    }

    const extractedData = await extractTechnicalSkillsWithAI(aiRawText);
    if (extractedData) {
      setResumeData({ ...resumeData, technical_skills: extractedData });
      setShowSkillsAIDialog(false);
      setAiRawText('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-background to-pink-50 dark:from-purple-950/20 dark:via-background dark:to-pink-950/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Link href="/playground" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Playground
            </Link>
            <Badge variant="secondary" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              Beta
            </Badge>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Resume Builder
          </h1>
          <p className="text-muted-foreground mt-2">
            Create, edit, and export professional resumes with AI assistance
          </p>
        </div>

        {/* API Key Configuration */}
        <Card className="mb-8 border-2 border-dashed border-purple-200 dark:border-purple-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TestTube className="w-5 h-5" />
              Gemini API Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="api-key">
                Gemini API Key
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 text-sm text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300"
                >
                  (Get your free API key)
                </a>
              </Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    id="api-key"
                    type={showApiKey ? 'text' : 'password'}
                    value={geminiApiKey}
                    onChange={(e) => setGeminiApiKey(e.target.value)}
                    placeholder="Enter your Gemini API key..."
                    className="pr-10"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  >
                    {showApiKey ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                <Button
                  onClick={() => testApiKey(geminiApiKey)}
                  disabled={isTestingApi || !geminiApiKey.trim()}
                  className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                >
                  {isTestingApi ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <TestTube className="w-4 h-4" />
                  )}
                  Test API
                </Button>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${
                apiStatus === 'success' ? 'bg-green-500' :
                apiStatus === 'error' ? 'bg-red-500' :
                apiStatus === 'testing' ? 'bg-yellow-500' : 'bg-gray-500'
              }`} />
              <span className={`text-sm ${
                apiStatus === 'success' ? 'text-green-600 dark:text-green-400' :
                apiStatus === 'error' ? 'text-red-600 dark:text-red-400' :
                apiStatus === 'testing' ? 'text-yellow-600 dark:text-yellow-400' : 'text-muted-foreground'
              }`}>
                {apiStatusMessage}
              </span>
            </div>

            {!isApiKeyValid && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  AI features (text rewriting, bullet generation, PDF/LaTeX import) are disabled until a valid API key is configured.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
          <Button
            onClick={importFromJSON}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Import JSON
          </Button>
          <Button
            onClick={importFromLaTeX}
            variant="outline"
            className="flex items-center gap-2"
            disabled={!isApiKeyValid}
          >
            <Upload className="w-4 h-4" />
            Import LaTeX
          </Button>
          <Button
            onClick={importFromPDF}
            variant="outline"
            className="flex items-center gap-2"
            disabled={!isApiKeyValid}
          >
            <Upload className="w-4 h-4" />
            Import PDF
          </Button>
          {importedResumeData && (
            <Button
              onClick={resetToOriginal}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reset to Original
            </Button>
          )}
          <Button
            onClick={resetToBlank}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset to Blank
          </Button>
        </div>

        {/* Resume Builder Form */}
        <div className="space-y-8">
          {/* Header Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <EditableField
                value={resumeData.name}
                path="name"
                placeholder="Your Full Name"
                withAI={false}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <EditableField
                  value={resumeData.contact.phone}
                  path="contact.phone"
                  placeholder="Phone Number"
                  withAI={false}
                  icon={Phone}
                />
                <EditableField
                  value={resumeData.contact.email}
                  path="contact.email"
                  placeholder="Email Address"
                  withAI={false}
                  icon={Mail}
                />
                <EditableField
                  value={resumeData.contact.linkedin}
                  path="contact.linkedin"
                  placeholder="LinkedIn URL"
                  withAI={false}
                  icon={Linkedin}
                />
                <EditableField
                  value={resumeData.contact.github}
                  path="contact.github"
                  placeholder="GitHub URL"
                  withAI={false}
                  icon={Github}
                />
              </div>
            </CardContent>
          </Card>

          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Professional Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <EditableField
                value={resumeData.summary}
                path="summary"
                isTextarea={true}
                placeholder="A brief summary of your skills and experience..."
                withAI={true}
              />
            </CardContent>
          </Card>

          {/* Technical Skills */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="w-5 h-5" />
                Technical Skills
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {resumeData.technical_skills.map((skill, index) => (
                  <div key={index} className="space-y-2 p-4 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <Select
                        value={skill.category || ''}
                        onValueChange={(value) => updateSkillCategory(index, value)}
                      >
                        <SelectTrigger className="font-medium">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {skillCategories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="flex gap-1">
                        {resumeData.technical_skills.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeSkillCategory(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                        )}
                        {index === resumeData.technical_skills.length - 1 && resumeData.technical_skills.length < 4 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={addSkillCategory}
                            className="text-green-500 hover:text-green-700"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                    <EditableField
                      value={skill.skills}
                      path={`technical_skills[${index}].skills`}
                      placeholder="List your skills (comma-separated)..."
                      withAI={true}
                    />
                  </div>
                ))}
              </div>
              
              {/* Only show Fill with AI when there are empty skill categories or only Languages is filled */}
              {(() => {
                const hasEmptyCategories = resumeData.technical_skills.some(
                  skill => !skill.skills || skill.skills.trim() === ''
                );
                const onlyLanguagesFilled = resumeData.technical_skills.length === 1 && 
                  resumeData.technical_skills[0].category.toLowerCase() === 'languages';
                
                return (hasEmptyCategories || onlyLanguagesFilled) && (
                  <div className="mt-4">
                    <Button
                      onClick={() => {
                        // For empty state, just open dialog with empty text
                        setAiRawText('');
                        setShowSkillsAIDialog(true);
                      }}
                      variant="outline"
                      disabled={!isApiKeyValid}
                      className="flex items-center gap-2"
                    >
                      <Sparkles className="w-4 h-4" />
                      Fill with AI
                    </Button>
                  </div>
                );
              })()}
            </CardContent>
          </Card>

          {/* Education */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                Education
              </CardTitle>
            </CardHeader>
            <CardContent>
              {resumeData.education.map((edu, index) => (
                <div key={index} className="space-y-4 p-4 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium">Education Entry {index + 1}</h4>
                    {resumeData.education.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newEducation = resumeData.education.filter((_, i) => i !== index);
                          setResumeData({ ...resumeData, education: newEducation });
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <EditableField
                      value={edu.institution}
                      path={`education[${index}].institution`}
                      placeholder="Institution Name"
                      withAI={false}
                    />
                    <EditableField
                      value={edu.location}
                      path={`education[${index}].location`}
                      placeholder="Location"
                      withAI={false}
                    />
                    <EditableField
                      value={edu.degree}
                      path={`education[${index}].degree`}
                      placeholder="Degree"
                      withAI={true}
                    />
                    <EditableField
                      value={edu.dates}
                      path={`education[${index}].dates`}
                      placeholder="Dates"
                      withAI={false}
                    />
                  </div>
                </div>
              ))}
              
              <Button
                onClick={() => {
                  const newEducation = [
                    ...resumeData.education,
                    { institution: '', location: '', degree: '', dates: '' }
                  ];
                  setResumeData({ ...resumeData, education: newEducation });
                }}
                className="mt-4"
                variant="outline"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Education
              </Button>
            </CardContent>
          </Card>

          {/* Experience */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Work Experience
              </CardTitle>
            </CardHeader>
            <CardContent>
              {resumeData.experience.map((exp, index) => (
                <div key={index} className="space-y-4 p-4 border rounded-lg mb-4">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium">Experience Entry {index + 1}</h4>
                    {resumeData.experience.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newExperience = resumeData.experience.filter((_, i) => i !== index);
                          setResumeData({ ...resumeData, experience: newExperience });
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <EditableField
                      value={exp.title}
                      path={`experience[${index}].title`}
                      placeholder="Job Title"
                      withAI={true}
                    />
                    <EditableField
                      value={exp.company}
                      path={`experience[${index}].company`}
                      placeholder="Company"
                      withAI={false}
                    />
                    <EditableField
                      value={exp.location}
                      path={`experience[${index}].location`}
                      placeholder="Location"
                      withAI={false}
                    />
                    <EditableField
                      value={exp.dates}
                      path={`experience[${index}].dates`}
                      placeholder="Dates"
                      withAI={false}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Job Responsibilities</Label>
                    {exp.duties.map((duty, dutyIndex) => (
                      <div key={dutyIndex} className="flex gap-2 items-start">
                        <div className="flex-1">
                          <EditableField
                            value={duty}
                            path={`experience[${index}].duties[${dutyIndex}]`}
                            isTextarea={true}
                            placeholder="Describe your responsibilities and achievements..."
                            withAI={true}
                          />
                        </div>
                        {exp.duties.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const newDuties = exp.duties.filter((_, i) => i !== dutyIndex);
                              updateData(`experience[${index}].duties`, newDuties);
                            }}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    
                    <div className="flex gap-2">
                      <Button
                        onClick={() => {
                          const newDuties = [...exp.duties, ''];
                          updateData(`experience[${index}].duties`, newDuties);
                        }}
                        variant="outline"
                        size="sm"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Responsibility
                      </Button>
                      
                      {isApiKeyValid && (
                        <Button
                          onClick={async () => {
                            // Validation: Check if job title and at least one bullet point exist
                            if (!exp.title || exp.title.trim() === '') {
                              alert('Please enter a job title before generating AI bullet points.');
                              return;
                            }
                            
                            if (!exp.duties || exp.duties.length === 0 || exp.duties.every(duty => !duty.trim())) {
                              alert('Please add at least one bullet point before generating additional ones with AI.');
                              return;
                            }

                            setIsLoading(true);
                            setLoadingMessage('AI is generating a new bullet point...');
                            try {
                              const contextForAI = {
                                title: exp.title,
                                company: exp.company,
                                location: exp.location,
                                dates: exp.dates,
                                existingDuties: exp.duties.filter(duty => duty.trim() !== '')
                              };
                              
                              const newBullet = await generateBulletPoint(contextForAI, 'Generate a new professional bullet point that complements the existing ones and showcases achievements and impact.');
                              const newDuties = [...exp.duties, newBullet];
                              updateData(`experience[${index}].duties`, newDuties);
                            } catch (error: any) {
                              alert(`Failed to generate bullet point: ${error.message}`);
                            } finally {
                              setIsLoading(false);
                            }
                          }}
                          size="sm"
                          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                        >
                          <Sparkles className="w-4 h-4 mr-2" />
                          AI Bullet Point
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    const newExperience = [
                      ...resumeData.experience,
                      { title: '', company: '', location: '', dates: '', duties: [''] }
                    ];
                    setResumeData({ ...resumeData, experience: newExperience });
                  }}
                  variant="outline"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Experience
                </Button>
                <Button
                  onClick={() => setShowExperienceAIDialog(true)}
                  variant="outline"
                  disabled={!isApiKeyValid}
                  className="flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Add with AI
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Projects */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5" />
                Projects
              </CardTitle>
            </CardHeader>
            <CardContent>
              {resumeData.projects.map((project, index) => (
                <div key={index} className="space-y-4 p-4 border rounded-lg mb-4">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium">Project {index + 1}</h4>
                    {resumeData.projects.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newProjects = resumeData.projects.filter((_, i) => i !== index);
                          setResumeData({ ...resumeData, projects: newProjects });
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <EditableField
                      value={project.name}
                      path={`projects[${index}].name`}
                      placeholder="Project Name"
                      withAI={false}
                    />
                    <EditableField
                      value={project.technologies}
                      path={`projects[${index}].technologies`}
                      placeholder="Technologies Used"
                      withAI={true}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Project Description</Label>
                    {project.description.map((desc, descIndex) => (
                      <div key={descIndex} className="flex gap-2 items-start">
                        <div className="flex-1">
                          <EditableField
                            value={desc}
                            path={`projects[${index}].description[${descIndex}]`}
                            isTextarea={true}
                            placeholder="Describe the project and your contributions..."
                            withAI={true}
                          />
                        </div>
                        {project.description.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const newDescription = project.description.filter((_, i) => i !== descIndex);
                              updateData(`projects[${index}].description`, newDescription);
                            }}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    
                    <div className="flex gap-2">
                      <Button
                        onClick={() => {
                          const newDescription = [...project.description, ''];
                          updateData(`projects[${index}].description`, newDescription);
                        }}
                        variant="outline"
                        size="sm"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Description
                      </Button>
                      
                      {isApiKeyValid && (
                        <Button
                          onClick={async () => {
                            // Validation: Check if project name and at least one description exist
                            if (!project.name || project.name.trim() === '') {
                              alert('Please enter a project name before generating AI bullet points.');
                              return;
                            }
                            
                            if (!project.description || project.description.length === 0 || project.description.every(desc => !desc.trim())) {
                              alert('Please add at least one description bullet point before generating additional ones with AI.');
                              return;
                            }

                            setIsLoading(true);
                            setLoadingMessage('AI is generating a new project bullet point...');
                            try {
                              const contextForAI = {
                                name: project.name,
                                technologies: project.technologies,
                                existingDescription: project.description.filter(desc => desc.trim() !== '')
                              };
                              
                              const newBullet = await generateBulletPoint(contextForAI, 'Generate a new professional bullet point that complements the existing project descriptions and showcases technical achievements and impact.');
                              const newDescription = [...project.description, newBullet];
                              updateData(`projects[${index}].description`, newDescription);
                            } catch (error: any) {
                              alert(`Failed to generate bullet point: ${error.message}`);
                            } finally {
                              setIsLoading(false);
                            }
                          }}
                          size="sm"
                          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                        >
                          <Sparkles className="w-4 h-4 mr-2" />
                          AI Bullet Point
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    const newProjects = [
                      ...resumeData.projects,
                      { name: '', technologies: '', description: [''] }
                    ];
                    setResumeData({ ...resumeData, projects: newProjects });
                  }}
                  variant="outline"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Project
                </Button>
                <Button
                  onClick={() => setShowProjectAIDialog(true)}
                  variant="outline"
                  disabled={!isApiKeyValid}
                  className="flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Add with AI
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Certifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Certifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              {resumeData.certifications.map((cert, index) => (
                <div key={index} className="space-y-4 p-4 border rounded-lg mb-4">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium">Certification {index + 1}</h4>
                    {resumeData.certifications.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newCertifications = resumeData.certifications.filter((_, i) => i !== index);
                          setResumeData({ ...resumeData, certifications: newCertifications });
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <EditableField
                      value={cert.name}
                      path={`certifications[${index}].name`}
                      placeholder="Certification Name"
                      withAI={false}
                    />
                    <EditableField
                      value={cert.issuer}
                      path={`certifications[${index}].issuer`}
                      placeholder="Issuing Organization"
                      withAI={false}
                    />
                  </div>
                </div>
              ))}
              
              <Button
                onClick={() => {
                  const newCertifications = [
                    ...resumeData.certifications,
                    { name: '', issuer: '' }
                  ];
                  setResumeData({ ...resumeData, certifications: newCertifications });
                }}
                variant="outline"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Certification
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Export Buttons */}
        <div className="flex flex-wrap gap-4 mt-8 pt-8 border-t">
          <Button
            onClick={exportToJSON}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download JSON
          </Button>
          <Button
            onClick={exportToLaTeX}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download LaTeX
          </Button>
        </div>

        {/* Loading Modal */}
        {isLoading && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-96">
              <CardContent className="p-6">
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
                  <p className="text-center">{loadingMessage}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* AI Dialogs */}
        {/* Experience AI Dialog */}
        <Dialog open={showExperienceAIDialog} onOpenChange={setShowExperienceAIDialog}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Extract Experience with AI</DialogTitle>
            </DialogHeader>
            <DialogDescription>
              <p className="text-sm text-muted-foreground mb-4">
                Use AI to extract and format work experience from your resume text.
              </p>
              <Textarea
                value={aiRawText}
                onChange={(e) => setAiRawText(e.target.value)}
                placeholder="Paste your resume text here..."
                className="min-h-[120px] resize-none"
                rows={4}
              />
              <div className="flex items-center gap-2 mt-4">
                <Label htmlFor="bulletCount" className="text-sm">
                  Number of bullet points:
                </Label>
                <Input
                  id="bulletCount"
                  type="number"
                  min="1"
                  max="10"
                  value={aiBulletCount}
                  onChange={(e) => setAiBulletCount(Number(e.target.value))}
                  className="w-20"
                />
              </div>
              <div className="flex gap-2 mt-4">
                <Button
                  onClick={() => setShowExperienceAIDialog(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleExperienceAI}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  Extract Experience
                </Button>
              </div>
            </DialogDescription>
          </DialogContent>
        </Dialog>

        {/* Project AI Dialog */}
        <Dialog open={showProjectAIDialog} onOpenChange={setShowProjectAIDialog}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Extract Project with AI</DialogTitle>
            </DialogHeader>
            <DialogDescription>
              <p className="text-sm text-muted-foreground mb-4">
                Use AI to extract and format project details from your resume text.
              </p>
              <Textarea
                value={aiRawText}
                onChange={(e) => setAiRawText(e.target.value)}
                placeholder="Paste your resume text here..."
                className="min-h-[120px] resize-none"
                rows={4}
              />
              <div className="flex items-center gap-2 mt-4">
                <Label htmlFor="bulletCount" className="text-sm">
                  Number of bullet points:
                </Label>
                <Input
                  id="bulletCount"
                  type="number"
                  min="1"
                  max="10"
                  value={aiBulletCount}
                  onChange={(e) => setAiBulletCount(Number(e.target.value))}
                  className="w-20"
                />
              </div>
              <div className="flex gap-2 mt-4">
                <Button
                  onClick={() => setShowProjectAIDialog(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleProjectAI}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  Extract Project
                </Button>
              </div>
            </DialogDescription>
          </DialogContent>
        </Dialog>

        {/* Skills AI Dialog */}
        <Dialog open={showSkillsAIDialog} onOpenChange={(open) => {
          setShowSkillsAIDialog(open);
          if (!open) setAiRawText('');
        }}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Fill Technical Skills with AI</DialogTitle>
            </DialogHeader>
            <DialogDescription>
              <p className="text-sm text-muted-foreground mb-4">
                Paste your resume text or list your technical skills. AI will extract and categorize them professionally.
              </p>
              <Textarea
                value={aiRawText}
                onChange={(e) => setAiRawText(e.target.value)}
                placeholder="Paste your resume text or list your skills here..."
                className="min-h-[120px] resize-none"
                rows={6}
              />
              <div className="flex gap-2 mt-4">
                <Button
                  onClick={() => {
                    setShowSkillsAIDialog(false);
                    setAiRawText('');
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSkillsAI}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  Extract & Fill Skills
                </Button>
              </div>
            </DialogDescription>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
