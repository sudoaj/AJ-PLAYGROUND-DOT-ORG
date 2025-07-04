'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { JobAnalysis, UserData } from '@/components/position-fit/JobDashboard';
import PositionFitAnalysis from '@/components/position-fit/PositionFitAnalysis';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function AnalysisPage() {
  const params = useParams();
  const router = useRouter();
  const [analysis, setAnalysis] = useState<JobAnalysis | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const analysisId = params.analysisId as string;

  // Load user data and find analysis
  useEffect(() => {
    const loadAnalysis = () => {
      try {
        // Get all users and find the one with this analysis
        let foundAnalysis: JobAnalysis | null = null;
        let foundUser: UserData | null = null;

        // Check all stored users
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('position-fit-user-')) {
            const userData = JSON.parse(localStorage.getItem(key) || '{}');
            const analysis = userData.analyses?.find((a: JobAnalysis) => a.id === analysisId);
            if (analysis) {
              foundAnalysis = analysis;
              foundUser = userData;
              break;
            }
          }
        }

        if (foundAnalysis && foundUser) {
          setAnalysis(foundAnalysis);
          setUserData(foundUser);
        } else {
          setError('Analysis not found');
        }
      } catch (err) {
        console.error('Error loading analysis:', err);
        setError('Failed to load analysis');
      } finally {
        setLoading(false);
      }
    };

    loadAnalysis();
  }, [analysisId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card>
            <CardContent className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p>Loading analysis...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !analysis || !userData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                {error || 'Analysis Not Found'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                {error || 'The requested analysis could not be found.'}
              </p>
              <Button asChild>
                <Link href="/playground/position-fit">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <PositionFitAnalysis 
      analysis={analysis} 
      userData={userData} 
      onBack={() => router.push('/playground/position-fit')}
    />
  );
}
