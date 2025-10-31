'use client';

import { useEffect, useState, useMemo } from 'react';
import { useGodModeStore } from '@/stores/god-mode-store';
import { useAuthStore } from '@/stores/auth-store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Crown, 
  Search, 
  Star, 
  Clock, 
  Building2, 
  Users, 
  GraduationCap,
  X,
  Check
} from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import type { University, ApiResponse } from '@/types';

interface UniversityWithStats extends University {
  colleges_count?: number;
  users_count?: number;
  storage_usage_percent?: number;
}

export function EnhancedGodModeSelector() {
  const { user } = useAuthStore();
  const {
    isGodMode,
    selectedUniversityId,
    universities,
    setGodMode,
    setSelectedUniversity,
    setUniversities,
  } = useGodModeStore();
  
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSelector, setShowSelector] = useState(false);
  const [universitiesWithStats, setUniversitiesWithStats] = useState<UniversityWithStats[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recentSelections, setRecentSelections] = useState<string[]>([]);

  const hasGodMode = user?.roles?.some(
    (role) => role === 'bitflow_owner' || role === 'bitflow_admin'
  );

  // Load from localStorage
  useEffect(() => {
    const storedFavorites = localStorage.getItem('god_mode_favorites');
    const storedRecent = localStorage.getItem('god_mode_recent');
    
    if (storedFavorites) {
      try {
        setFavorites(JSON.parse(storedFavorites));
      } catch (e) {
        console.error('Failed to parse favorites:', e);
      }
    }
    
    if (storedRecent) {
      try {
        setRecentSelections(JSON.parse(storedRecent));
      } catch (e) {
        console.error('Failed to parse recent selections:', e);
      }
    }
  }, []);

  useEffect(() => {
    if (hasGodMode) {
      setGodMode(true);
      loadUniversitiesWithStats();
    } else {
      setGodMode(false);
    }
  }, [hasGodMode]);

  const loadUniversitiesWithStats = async () => {
    try {
      setLoading(true);
      
      // Load universities with counts
      const response = await apiClient.get<ApiResponse<UniversityWithStats[]>>(
        '/universities?include_counts=true'
      );
      
      const universitiesData = response.data || [];
      setUniversities(universitiesData);
      setUniversitiesWithStats(universitiesData);
    } catch (error) {
      console.error('Failed to load universities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUniversitySelect = (universityId: string | null) => {
    setSelectedUniversity(universityId);
    setShowSelector(false);
    
    // Update recent selections
    if (universityId) {
      const updated = [universityId, ...recentSelections.filter(id => id !== universityId)].slice(0, 5);
      setRecentSelections(updated);
      localStorage.setItem('god_mode_recent', JSON.stringify(updated));
    }
  };

  const toggleFavorite = (universityId: string) => {
    const updated = favorites.includes(universityId)
      ? favorites.filter(id => id !== universityId)
      : [...favorites, universityId];
    
    setFavorites(updated);
    localStorage.setItem('god_mode_favorites', JSON.stringify(updated));
  };

  // Filter universities based on search
  const filteredUniversities = useMemo(() => {
    if (!searchQuery) return universitiesWithStats;
    
    const query = searchQuery.toLowerCase();
    return universitiesWithStats.filter(uni =>
      uni.name.toLowerCase().includes(query) ||
      uni.domain?.toLowerCase().includes(query)
    );
  }, [universitiesWithStats, searchQuery]);

  // Get favorite universities
  const favoriteUniversities = useMemo(() => {
    return universitiesWithStats.filter(uni => favorites.includes(uni.id));
  }, [universitiesWithStats, favorites]);

  // Get recent universities
  const recentUniversities = useMemo(() => {
    return recentSelections
      .map(id => universitiesWithStats.find(uni => uni.id === id))
      .filter(Boolean) as UniversityWithStats[];
  }, [universitiesWithStats, recentSelections]);

  // Get current selected university
  const selectedUniversity = universitiesWithStats.find(
    uni => uni.id === selectedUniversityId
  );

  if (!hasGodMode || !isGodMode) {
    return null;
  }

  return (
    <div className="relative">
      {/* God Mode Badge with Selector Button */}
      <Button
        variant="outline"
        onClick={() => setShowSelector(!showSelector)}
        className="flex items-center gap-2 bg-yellow-50 border-yellow-500 text-yellow-700 hover:bg-yellow-100"
      >
        <Crown className="h-4 w-4" />
        <span className="font-medium">God Mode</span>
        {selectedUniversity ? (
          <Badge variant="default" className="ml-1">
            {selectedUniversity.name}
          </Badge>
        ) : (
          <Badge variant="info" className="ml-1">
            All Universities
          </Badge>
        )}
      </Button>

      {/* Selector Dropdown */}
      {showSelector && (
        <div className="absolute right-0 top-full mt-2 w-[500px] z-50">
          <Card className="shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Select University</CardTitle>
                  <CardDescription>
                    Switch context to view specific university data
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSelector(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Search */}
              <div className="relative mt-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search universities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </CardHeader>

            <CardContent className="max-h-[500px] overflow-y-auto space-y-4">
              {/* All Universities Option */}
              <div
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  !selectedUniversityId
                    ? 'bg-blue-50 border-2 border-blue-500'
                    : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                }`}
                onClick={() => handleUniversitySelect(null)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">All Universities</span>
                  </div>
                  {!selectedUniversityId && (
                    <Check className="h-5 w-5 text-blue-600" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1 ml-7">
                  View aggregated data across all universities
                </p>
              </div>

              {/* Favorites */}
              {favoriteUniversities.length > 0 && !searchQuery && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    Favorites
                  </h3>
                  <div className="space-y-2">
                    {favoriteUniversities.map((uni) => (
                      <UniversityCard
                        key={uni.id}
                        university={uni}
                        isSelected={selectedUniversityId === uni.id}
                        isFavorite={true}
                        onSelect={handleUniversitySelect}
                        onToggleFavorite={toggleFavorite}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Recent */}
              {recentUniversities.length > 0 && !searchQuery && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Recent
                  </h3>
                  <div className="space-y-2">
                    {recentUniversities.map((uni) => (
                      <UniversityCard
                        key={uni.id}
                        university={uni}
                        isSelected={selectedUniversityId === uni.id}
                        isFavorite={favorites.includes(uni.id)}
                        onSelect={handleUniversitySelect}
                        onToggleFavorite={toggleFavorite}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* All Universities */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  {searchQuery ? 'Search Results' : 'All Universities'}
                </h3>
                <div className="space-y-2">
                  {loading ? (
                    <p className="text-sm text-muted-foreground">Loading...</p>
                  ) : filteredUniversities.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No universities found.</p>
                  ) : (
                    filteredUniversities.map((uni) => (
                      <UniversityCard
                        key={uni.id}
                        university={uni}
                        isSelected={selectedUniversityId === uni.id}
                        isFavorite={favorites.includes(uni.id)}
                        onSelect={handleUniversitySelect}
                        onToggleFavorite={toggleFavorite}
                      />
                    ))
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

interface UniversityCardProps {
  university: UniversityWithStats;
  isSelected: boolean;
  isFavorite: boolean;
  onSelect: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

function UniversityCard({ 
  university, 
  isSelected, 
  isFavorite, 
  onSelect, 
  onToggleFavorite 
}: UniversityCardProps) {
  return (
    <div
      className={`p-3 rounded-lg cursor-pointer transition-colors ${
        isSelected
          ? 'bg-blue-50 border-2 border-blue-500'
          : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
      }`}
      onClick={() => onSelect(university.id)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{university.name}</span>
            {isSelected && <Check className="h-4 w-4 text-blue-600" />}
          </div>
          
          {university.domain && (
            <p className="text-xs text-muted-foreground mt-1 ml-6">
              {university.domain}
            </p>
          )}

          {/* Stats */}
          <div className="flex items-center gap-4 mt-2 ml-6">
            {university.colleges_count !== undefined && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <GraduationCap className="h-3 w-3" />
                <span>{university.colleges_count} colleges</span>
              </div>
            )}
            {university.users_count !== undefined && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Users className="h-3 w-3" />
                <span>{university.users_count} users</span>
              </div>
            )}
          </div>
        </div>

        {/* Favorite Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(university.id);
          }}
          className="ml-2"
        >
          <Star 
            className={`h-4 w-4 ${
              isFavorite ? 'fill-yellow-500 text-yellow-500' : 'text-muted-foreground'
            }`}
          />
        </Button>
      </div>
    </div>
  );
}
