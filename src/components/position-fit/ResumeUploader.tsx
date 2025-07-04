'use client';

import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  File,
  User,
  Briefcase,
  GraduationCap,
  Code,
  FolderOpen
} from 'lucide-react';

interface ParsedResume {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
  };
  experience: Array<{
    title: string;
    company: string;
    duration: string;
    responsibilities: string[];
  }>;
  education: Array<{
    degree: string;
    institution: string;
    year: string;
  }>;
  skills: Array<{
    category: string;
    skills: string[];
  }>;
  projects: Array<{
    name: string;
    description: string;
    technologies: string[];
  }>;
}

interface ResumeUploaderProps {
  onResumeParsed: (resume: ParsedResume) => void;
  apiKey?: string;
  isApiKeyValid?: boolean;
}

export default function ResumeUploader({ onResumeParsed, apiKey, isApiKeyValid }: ResumeUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [parseProgress, setParseProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [parsedResume, setParsedResume] = useState<ParsedResume | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = (file: File) => {
    setError(null);
    
    // Validate file type
    const allowedTypes = ['application/pdf', 'text/plain', 'application/x-latex'];
    const allowedExtensions = ['.pdf', '.txt', '.tex', '.latex'];
    
    const isValidType = allowedTypes.includes(file.type) || 
                       allowedExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
    
    if (!isValidType) {
      setError('Please upload a PDF, TXT, or LaTeX file');
      return;
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    setUploadedFile(file);
    parseResume(file);
  };

  const parseResume = async (file: File) => {
    setIsParsing(true);
    setParseProgress(0);
    setError(null);

    try {
      if (!apiKey || !isApiKeyValid) {
        setError('API key required for resume parsing. Please configure your Gemini API key.');
        return;
      }

      // Step 1: Extract text from file
      setParseProgress(20);
      let extractedText = '';

      if (file.type === 'application/pdf') {
        // Import pdfjs-dist dynamically for client-side usage
        const pdfjsLib = await import('pdfjs-dist');
        pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
        
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        
        setParseProgress(40);
        
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items
            .map((item: any) => item.str)
            .join(' ');
          extractedText += pageText + '\n';
        }
      } else {
        // For text files
        extractedText = await file.text();
        setParseProgress(40);
      }

      if (!extractedText || extractedText.trim().length === 0) {
        throw new Error('No text could be extracted from the file');
      }

      // Step 2: Parse with AI
      setParseProgress(60);
      
      const parsePrompt = `You are an expert resume parser. Parse the following resume text and extract structured information.

RESUME TEXT:
${extractedText}

Extract and return ONLY valid JSON in this exact format:
{
  "personalInfo": {
    "name": "Full Name",
    "email": "email@example.com", 
    "phone": "+1 (555) 123-4567",
    "location": "City, State"
  },
  "experience": [
    {
      "title": "Job Title",
      "company": "Company Name",
      "duration": "Start - End",
      "responsibilities": ["responsibility 1", "responsibility 2"]
    }
  ],
  "education": [
    {
      "degree": "Degree Type",
      "institution": "School Name", 
      "year": "Graduation Year"
    }
  ],
  "skills": [
    {
      "category": "Category Name",
      "skills": ["skill1", "skill2", "skill3"]
    }
  ],
  "projects": [
    {
      "name": "Project Name",
      "description": "Project description",
      "technologies": ["tech1", "tech2"]
    }
  ]
}

IMPORTANT: Return ONLY the JSON object, no explanations or markdown formatting.`;

      const response = await callGeminiAPI(parsePrompt);
      const cleanedResponse = response.replace(/```json\n?|\n?```/g, '').trim();
      const parsedData = JSON.parse(cleanedResponse);
      
      setParseProgress(100);
      setParsedResume(parsedData);
      onResumeParsed(parsedData);
      
    } catch (error: any) {
      console.error('Resume parsing failed:', error);
      setError(`Failed to parse resume: ${error.message}`);
    } finally {
      setIsParsing(false);
    }
  };

  const callGeminiAPI = async (prompt: string): Promise<string> => {
    if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
      throw new Error('Invalid prompt provided');
    }

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

  const handleTryAgain = () => {
    setUploadedFile(null);
    setParsedResume(null);
    setError(null);
    setParseProgress(0);
  };

  if (parsedResume) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            Resume Parsed Successfully
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Personal Info */}
            <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
              <User className="w-8 h-8 text-blue-500" />
              <div>
                <h3 className="font-semibold">{parsedResume.personalInfo.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {parsedResume.personalInfo.email} • {parsedResume.personalInfo.location}
                </p>
              </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <Briefcase className="w-6 h-6 mx-auto mb-1 text-blue-500" />
                <div className="text-2xl font-bold">{parsedResume.experience.length}</div>
                <div className="text-xs text-muted-foreground">Positions</div>
              </div>
              
              <div className="text-center p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                <Code className="w-6 h-6 mx-auto mb-1 text-green-500" />
                <div className="text-2xl font-bold">
                  {parsedResume.skills.reduce((acc, cat) => acc + cat.skills.length, 0)}
                </div>
                <div className="text-xs text-muted-foreground">Skills</div>
              </div>
              
              <div className="text-center p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                <GraduationCap className="w-6 h-6 mx-auto mb-1 text-purple-500" />
                <div className="text-2xl font-bold">{parsedResume.education.length}</div>
                <div className="text-xs text-muted-foreground">Education</div>
              </div>
              
              <div className="text-center p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                <FolderOpen className="w-6 h-6 mx-auto mb-1 text-orange-500" />
                <div className="text-2xl font-bold">{parsedResume.projects.length}</div>
                <div className="text-xs text-muted-foreground">Projects</div>
              </div>
            </div>

            {/* Skills Preview */}
            <div>
              <h4 className="font-medium mb-3">Skills Overview</h4>
              <div className="space-y-2">
                {parsedResume.skills.map((category, index) => (
                  <div key={index} className="flex flex-wrap gap-1">
                    <Badge variant="outline" className="mr-2">{category.category}:</Badge>
                    {category.skills.slice(0, 5).map((skill, skillIndex) => (
                      <Badge key={skillIndex} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {category.skills.length > 5 && (
                      <Badge variant="secondary" className="text-xs">
                        +{category.skills.length - 5} more
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Experience Preview */}
            <div>
              <h4 className="font-medium mb-3">Recent Experience</h4>
              <div className="space-y-3">
                {parsedResume.experience.slice(0, 2).map((exp, index) => (
                  <div key={index} className="border-l-2 border-blue-200 pl-4">
                    <h5 className="font-medium">{exp.title}</h5>
                    <p className="text-sm text-muted-foreground">{exp.company} • {exp.duration}</p>
                    <p className="text-sm mt-1">{exp.responsibilities[0]}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleTryAgain} variant="outline">
                Upload Different Resume
              </Button>
              <Button onClick={() => onResumeParsed(parsedResume)}>
                Continue to Analysis
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Resume Upload
        </CardTitle>
        <p className="text-muted-foreground">
          Upload your resume in PDF, TXT, or LaTeX format for analysis
        </p>
      </CardHeader>
      <CardContent>
        {isParsing ? (
          <div className="text-center py-12">
            <Loader2 className="w-12 h-12 mx-auto mb-4 text-blue-500 animate-spin" />
            <h3 className="text-lg font-semibold mb-2">Parsing Your Resume</h3>
            <p className="text-muted-foreground mb-4">
              Extracting information from your resume...
            </p>
            <Progress value={parseProgress} className="w-64 mx-auto" />
            <p className="text-sm text-muted-foreground mt-2">{parseProgress}% complete</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Upload Area */}
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragOver 
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20' 
                  : 'border-muted-foreground/25 hover:border-muted-foreground/50'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <File className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">
                {isDragOver ? 'Drop your resume here' : 'Upload your resume'}
              </h3>
              <p className="text-muted-foreground mb-4">
                Drag and drop your file here, or click to browse
              </p>
              
              <input
                type="file"
                id="resume-upload"
                className="hidden"
                accept=".pdf,.txt,.tex,.latex"
                onChange={handleFileInput}
              />
              
              <Button asChild>
                <label htmlFor="resume-upload" className="cursor-pointer">
                  <FileText className="w-4 h-4 mr-2" />
                  Choose File
                </label>
              </Button>
              
              {uploadedFile && (
                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <p className="text-sm font-medium">{uploadedFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              )}
            </div>

            {/* Supported Formats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <FileText className="w-6 h-6 mx-auto mb-2 text-red-500" />
                <div className="text-sm font-medium">PDF</div>
                <div className="text-xs text-muted-foreground">Most common format</div>
              </div>
              
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <FileText className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                <div className="text-sm font-medium">TXT</div>
                <div className="text-xs text-muted-foreground">Plain text format</div>
              </div>
              
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <FileText className="w-6 h-6 mx-auto mb-2 text-green-500" />
                <div className="text-sm font-medium">LaTeX</div>
                <div className="text-xs text-muted-foreground">Academic format</div>
              </div>
            </div>

            {error && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* What we extract */}
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium mb-2">Information we extract:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Personal information (name, contact details)</li>
                <li>• Work experience and job responsibilities</li>
                <li>• Education background and certifications</li>
                <li>• Technical and soft skills</li>
                <li>• Projects and achievements</li>
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
