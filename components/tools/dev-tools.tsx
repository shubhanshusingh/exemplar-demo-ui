"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Copy, Check, Key, Hash, Code, Link, Shuffle, Lock, Search } from "lucide-react"

interface DevToolsProps {
  onQuickAction: (action: string) => void
}

export default function DevTools({ onQuickAction }: DevToolsProps) {
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>({})

  // JWT Tool State
  const [jwtPayload, setJwtPayload] = useState(
    '{\n  "sub": "1234567890",\n  "name": "John Doe",\n  "iat": 1516239022\n}',
  )
  const [jwtSecret, setJwtSecret] = useState("your-256-bit-secret")
  const [jwtToken, setJwtToken] = useState("")
  const [jwtDecoded, setJwtDecoded] = useState("")

  // Base64 Tool State
  const [base64Input, setBase64Input] = useState("")
  const [base64Output, setBase64Output] = useState("")
  const [base64Mode, setBase64Mode] = useState<"encode" | "decode">("encode")

  // Hash Tool State
  const [hashInput, setHashInput] = useState("")
  const [hashType, setHashType] = useState("sha256")
  const [hashOutput, setHashOutput] = useState("")

  // JSON Tool State
  const [jsonInput, setJsonInput] = useState("")
  const [jsonOutput, setJsonOutput] = useState("")
  const [jsonError, setJsonError] = useState("")

  // URL Tool State
  const [urlInput, setUrlInput] = useState("")
  const [urlOutput, setUrlOutput] = useState("")
  const [urlMode, setUrlMode] = useState<"encode" | "decode">("encode")

  // UUID Tool State
  const [uuidOutput, setUuidOutput] = useState("")

  // Password Tool State
  const [passwordLength, setPasswordLength] = useState(16)
  const [includeUppercase, setIncludeUppercase] = useState(true)
  const [includeLowercase, setIncludeLowercase] = useState(true)
  const [includeNumbers, setIncludeNumbers] = useState(true)
  const [includeSymbols, setIncludeSymbols] = useState(true)
  const [passwordOutput, setPasswordOutput] = useState("")

  // Regex Tool State
  const [regexPattern, setRegexPattern] = useState("")
  const [regexFlags, setRegexFlags] = useState("g")
  const [regexTestString, setRegexTestString] = useState("")
  const [regexMatches, setRegexMatches] = useState<string[]>([])
  const [regexError, setRegexError] = useState("")

  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedStates({ ...copiedStates, [key]: true })
      setTimeout(() => {
        setCopiedStates({ ...copiedStates, [key]: false })
      }, 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  // JWT Functions
  const generateJWT = () => {
    try {
      const header = { alg: "HS256", typ: "JWT" }
      const payload = JSON.parse(jwtPayload)

      const encodedHeader = btoa(JSON.stringify(header)).replace(/=/g, "")
      const encodedPayload = btoa(JSON.stringify(payload)).replace(/=/g, "")

      // Simple signature simulation (not cryptographically secure)
      const signature = btoa(`${encodedHeader}.${encodedPayload}.${jwtSecret}`).replace(/=/g, "").substring(0, 43)

      const token = `${encodedHeader}.${encodedPayload}.${signature}`
      setJwtToken(token)
    } catch (error) {
      setJwtToken("Invalid JSON payload")
    }
  }

  const decodeJWT = () => {
    try {
      const parts = jwtToken.split(".")
      if (parts.length !== 3) {
        setJwtDecoded("Invalid JWT format")
        return
      }

      const header = JSON.parse(atob(parts[0]))
      const payload = JSON.parse(atob(parts[1]))

      const decoded = {
        header,
        payload,
        signature: parts[2],
      }

      setJwtDecoded(JSON.stringify(decoded, null, 2))
    } catch (error) {
      setJwtDecoded("Invalid JWT token")
    }
  }

  // Base64 Functions
  const processBase64 = () => {
    try {
      if (base64Mode === "encode") {
        setBase64Output(btoa(base64Input))
      } else {
        setBase64Output(atob(base64Input))
      }
    } catch (error) {
      setBase64Output("Invalid input for decoding")
    }
  }

  // Hash Functions
  const generateHash = async () => {
    try {
      const encoder = new TextEncoder()
      const data = encoder.encode(hashInput)

      let algorithm = "SHA-256"
      if (hashType === "sha1") algorithm = "SHA-1"
      if (hashType === "sha512") algorithm = "SHA-512"

      const hashBuffer = await crypto.subtle.digest(algorithm, data)
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")

      setHashOutput(hashHex)
    } catch (error) {
      setHashOutput("Error generating hash")
    }
  }

  // JSON Functions
  const formatJSON = () => {
    try {
      const parsed = JSON.parse(jsonInput)
      setJsonOutput(JSON.stringify(parsed, null, 2))
      setJsonError("")
    } catch (error) {
      setJsonError("Invalid JSON format")
      setJsonOutput("")
    }
  }

  // URL Functions
  const processURL = () => {
    try {
      if (urlMode === "encode") {
        setUrlOutput(encodeURIComponent(urlInput))
      } else {
        setUrlOutput(decodeURIComponent(urlInput))
      }
    } catch (error) {
      setUrlOutput("Invalid input for decoding")
    }
  }

  // UUID Functions
  const generateUUID = () => {
    const uuid = crypto.randomUUID()
    setUuidOutput(uuid)
  }

  // Password Functions
  const generatePassword = () => {
    let charset = ""
    if (includeUppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    if (includeLowercase) charset += "abcdefghijklmnopqrstuvwxyz"
    if (includeNumbers) charset += "0123456789"
    if (includeSymbols) charset += "!@#$%^&*()_+-=[]{}|;:,.<>?"

    if (charset === "") {
      setPasswordOutput("Please select at least one character type")
      return
    }

    let password = ""
    for (let i = 0; i < passwordLength; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length))
    }

    setPasswordOutput(password)
  }

  // Regex Functions
  const testRegex = () => {
    try {
      const regex = new RegExp(regexPattern, regexFlags)
      const matches = regexTestString.match(regex) || []
      setRegexMatches(matches)
      setRegexError("")
    } catch (error) {
      setRegexError("Invalid regex pattern")
      setRegexMatches([])
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-posthog-black font-mono">DEVELOPER_UTILITIES</h1>
          <p className="text-sm text-posthog-gray font-mono">ESSENTIAL_TOOLS_FOR_DEVELOPMENT_AND_DEBUGGING</p>
        </div>
      </div>

      {/* Tools Tabs */}
      <Tabs defaultValue="jwt">
        <TabsList className="bg-card border border-border">
          <TabsTrigger
            value="jwt"
            className="font-mono text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Key className="h-5 w-5 text-brand-orange" />
            JWT
          </TabsTrigger>
          <TabsTrigger
            value="base64"
            className="font-mono text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Code className="h-5 w-5 text-brand-orange" />
            BASE64
          </TabsTrigger>
          <TabsTrigger
            value="hash"
            className="font-mono text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Hash className="h-5 w-5 text-brand-orange" />
            HASH
          </TabsTrigger>
          <TabsTrigger
            value="json"
            className="font-mono text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Code className="h-5 w-5 text-brand-orange" />
            JSON
          </TabsTrigger>
          <TabsTrigger
            value="url"
            className="font-mono text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Link className="h-5 w-5 text-brand-orange" />
            URL
          </TabsTrigger>
          <TabsTrigger
            value="uuid"
            className="font-mono text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Shuffle className="h-5 w-5 text-brand-orange" />
            UUID
          </TabsTrigger>
          <TabsTrigger
            value="password"
            className="font-mono text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Lock className="h-5 w-5 text-brand-orange" />
            PASS
          </TabsTrigger>
          <TabsTrigger
            value="regex"
            className="font-mono text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Search className="h-5 w-5 text-brand-orange" />
            REGEX
          </TabsTrigger>
        </TabsList>

        {/* JWT Tool */}
        <TabsContent value="jwt" className="space-y-4">
          <Card className="border-posthog-cream-dark bg-white">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 font-mono text-posthog-black">
                <Key className="h-5 w-5 text-brand-orange" />
                JWT_GENERATOR_/_DECODER
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <Label className="font-mono text-xs text-posthog-black">PAYLOAD</Label>
                    <Textarea
                      value={jwtPayload}
                      onChange={(e) => setJwtPayload(e.target.value)}
                      className="font-mono text-xs border-posthog-orange"
                      rows={6}
                    />
                  </div>
                  <div>
                    <Label className="font-mono text-xs text-posthog-black">SECRET</Label>
                    <Input
                      value={jwtSecret}
                      onChange={(e) => setJwtSecret(e.target.value)}
                      className="font-mono text-xs border-posthog-orange"
                    />
                  </div>
                  <Button
                    onClick={generateJWT}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-mono text-xs"
                  >
                    GENERATE_JWT
                  </Button>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="font-mono text-xs text-posthog-black">JWT_TOKEN</Label>
                      <Button
                        onClick={() => copyToClipboard(jwtToken, "jwt-token")}
                        variant="outline"
                        size="sm"
                        className="font-mono text-xs"
                      >
                        {copiedStates["jwt-token"] ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                      </Button>
                    </div>
                    <Textarea
                      value={jwtToken}
                      onChange={(e) => setJwtToken(e.target.value)}
                      className="font-mono text-xs border-posthog-orange"
                      rows={4}
                    />
                  </div>
                  <Button
                    onClick={decodeJWT}
                    variant="outline"
                    className="font-mono text-xs border-posthog-orange text-posthog-orange bg-transparent"
                  >
                    DECODE_JWT
                  </Button>
                  {jwtDecoded && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label className="font-mono text-xs text-posthog-black">DECODED</Label>
                        <Button
                          onClick={() => copyToClipboard(jwtDecoded, "jwt-decoded")}
                          variant="outline"
                          size="sm"
                          className="font-mono text-xs"
                        >
                          {copiedStates["jwt-decoded"] ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                        </Button>
                      </div>
                      <Textarea value={jwtDecoded} readOnly className="font-mono text-xs bg-posthog-cream" rows={6} />
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Base64 Tool */}
        <TabsContent value="base64" className="space-y-4">
          <Card className="border-posthog-cream-dark bg-white">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 font-mono text-posthog-black">
                <Code className="h-5 w-5 text-brand-orange" />
                BASE64_ENCODER_/_DECODER
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 mb-4">
                <Label className="font-mono text-xs text-posthog-black">MODE:</Label>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setBase64Mode("encode")}
                    variant={base64Mode === "encode" ? "default" : "outline"}
                    size="sm"
                    className="font-mono text-xs"
                  >
                    ENCODE
                  </Button>
                  <Button
                    onClick={() => setBase64Mode("decode")}
                    variant={base64Mode === "decode" ? "default" : "outline"}
                    size="sm"
                    className="font-mono text-xs"
                  >
                    DECODE
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <Label className="font-mono text-xs text-posthog-black">INPUT</Label>
                  <Textarea
                    value={base64Input}
                    onChange={(e) => setBase64Input(e.target.value)}
                    className="font-mono text-xs border-posthog-orange"
                    rows={6}
                  />
                  <Button
                    onClick={processBase64}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-mono text-xs mt-2"
                  >
                    {base64Mode === "encode" ? "ENCODE" : "DECODE"}
                  </Button>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="font-mono text-xs text-posthog-black">OUTPUT</Label>
                    <Button
                      onClick={() => copyToClipboard(base64Output, "base64-output")}
                      variant="outline"
                      size="sm"
                      className="font-mono text-xs"
                    >
                      {copiedStates["base64-output"] ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    </Button>
                  </div>
                  <Textarea value={base64Output} readOnly className="font-mono text-xs bg-posthog-cream" rows={6} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Hash Tool */}
        <TabsContent value="hash" className="space-y-4">
          <Card className="border-posthog-cream-dark bg-white">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 font-mono text-posthog-black">
                <Hash className="h-5 w-5 text-brand-orange" />
                HASH_GENERATOR
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 mb-4">
                <Label className="font-mono text-xs text-posthog-black">ALGORITHM:</Label>
                <Select value={hashType} onValueChange={setHashType}>
                  <SelectTrigger className="w-32 font-mono text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sha1">SHA-1</SelectItem>
                    <SelectItem value="sha256">SHA-256</SelectItem>
                    <SelectItem value="sha512">SHA-512</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <Label className="font-mono text-xs text-posthog-black">INPUT</Label>
                  <Textarea
                    value={hashInput}
                    onChange={(e) => setHashInput(e.target.value)}
                    className="font-mono text-xs border-posthog-orange"
                    rows={6}
                  />
                  <Button
                    onClick={generateHash}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-mono text-xs mt-2"
                  >
                    GENERATE_HASH
                  </Button>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="font-mono text-xs text-posthog-black">HASH_OUTPUT</Label>
                    <Button
                      onClick={() => copyToClipboard(hashOutput, "hash-output")}
                      variant="outline"
                      size="sm"
                      className="font-mono text-xs"
                    >
                      {copiedStates["hash-output"] ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    </Button>
                  </div>
                  <Textarea value={hashOutput} readOnly className="font-mono text-xs bg-posthog-cream" rows={6} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* JSON Tool */}
        <TabsContent value="json" className="space-y-4">
          <Card className="border-posthog-cream-dark bg-white">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 font-mono text-posthog-black">
                <Code className="h-5 w-5 text-brand-orange" />
                JSON_FORMATTER_/_VALIDATOR
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <Label className="font-mono text-xs text-posthog-black">JSON_INPUT</Label>
                  <Textarea
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                    className="font-mono text-xs border-posthog-orange"
                    rows={8}
                  />
                  <Button
                    onClick={formatJSON}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-mono text-xs mt-2"
                  >
                    FORMAT_/_VALIDATE
                  </Button>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="font-mono text-xs text-posthog-black">FORMATTED_JSON</Label>
                    <Button
                      onClick={() => copyToClipboard(jsonOutput, "json-output")}
                      variant="outline"
                      size="sm"
                      className="font-mono text-xs"
                    >
                      {copiedStates["json-output"] ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    </Button>
                  </div>
                  <Textarea value={jsonOutput} readOnly className="font-mono text-xs bg-posthog-cream" rows={8} />
                  {jsonError && <div className="text-red-600 text-xs font-mono mt-2">{jsonError}</div>}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* URL Tool */}
        <TabsContent value="url" className="space-y-4">
          <Card className="border-posthog-cream-dark bg-white">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 font-mono text-posthog-black">
                <Link className="h-5 w-5 text-brand-orange" />
                URL_ENCODER_/_DECODER
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 mb-4">
                <Label className="font-mono text-xs text-posthog-black">MODE:</Label>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setUrlMode("encode")}
                    variant={urlMode === "encode" ? "default" : "outline"}
                    size="sm"
                    className="font-mono text-xs"
                  >
                    ENCODE
                  </Button>
                  <Button
                    onClick={() => setUrlMode("decode")}
                    variant={urlMode === "decode" ? "default" : "outline"}
                    size="sm"
                    className="font-mono text-xs"
                  >
                    DECODE
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <Label className="font-mono text-xs text-posthog-black">INPUT</Label>
                  <Textarea
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    className="font-mono text-xs border-posthog-orange"
                    rows={6}
                  />
                  <Button
                    onClick={processURL}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-mono text-xs mt-2"
                  >
                    {urlMode === "encode" ? "ENCODE" : "DECODE"}
                  </Button>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="font-mono text-xs text-posthog-black">OUTPUT</Label>
                    <Button
                      onClick={() => copyToClipboard(urlOutput, "url-output")}
                      variant="outline"
                      size="sm"
                      className="font-mono text-xs"
                    >
                      {copiedStates["url-output"] ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    </Button>
                  </div>
                  <Textarea value={urlOutput} readOnly className="font-mono text-xs bg-posthog-cream" rows={6} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* UUID Tool */}
        <TabsContent value="uuid" className="space-y-4">
          <Card className="border-posthog-cream-dark bg-white">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 font-mono text-posthog-black">
                <Shuffle className="h-5 w-5 text-brand-orange" />
                UUID_GENERATOR
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Button
                  onClick={generateUUID}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-mono text-xs"
                >
                  GENERATE_UUID
                </Button>
                <Badge variant="outline" className="font-mono text-xs">
                  VERSION_4
                </Badge>
              </div>
              {uuidOutput && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="font-mono text-xs text-posthog-black">UUID_OUTPUT</Label>
                    <Button
                      onClick={() => copyToClipboard(uuidOutput, "uuid-output")}
                      variant="outline"
                      size="sm"
                      className="font-mono text-xs"
                    >
                      {copiedStates["uuid-output"] ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    </Button>
                  </div>
                  <Input value={uuidOutput} readOnly className="font-mono text-xs bg-posthog-cream" />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Password Tool */}
        <TabsContent value="password" className="space-y-4">
          <Card className="border-posthog-cream-dark bg-white">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 font-mono text-posthog-black">
                <Lock className="h-5 w-5 text-brand-orange" />
                PASSWORD_GENERATOR
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="font-mono text-xs text-posthog-black">LENGTH: {passwordLength}</Label>
                    <Input
                      type="range"
                      min="4"
                      max="64"
                      value={passwordLength}
                      onChange={(e) => setPasswordLength(Number(e.target.value))}
                      className="mt-2"
                    />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="font-mono text-xs text-posthog-black">UPPERCASE_LETTERS</Label>
                      <Switch checked={includeUppercase} onCheckedChange={setIncludeUppercase} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="font-mono text-xs text-posthog-black">LOWERCASE_LETTERS</Label>
                      <Switch checked={includeLowercase} onCheckedChange={setIncludeLowercase} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="font-mono text-xs text-posthog-black">NUMBERS</Label>
                      <Switch checked={includeNumbers} onCheckedChange={setIncludeNumbers} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="font-mono text-xs text-posthog-black">SYMBOLS</Label>
                      <Switch checked={includeSymbols} onCheckedChange={setIncludeSymbols} />
                    </div>
                  </div>
                  <Button
                    onClick={generatePassword}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-mono text-xs"
                  >
                    GENERATE_PASSWORD
                  </Button>
                </div>
                <div>
                  {passwordOutput && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label className="font-mono text-xs text-posthog-black">GENERATED_PASSWORD</Label>
                        <Button
                          onClick={() => copyToClipboard(passwordOutput, "password-output")}
                          variant="outline"
                          size="sm"
                          className="font-mono text-xs"
                        >
                          {copiedStates["password-output"] ? (
                            <Check className="h-3 w-3" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                      <Input value={passwordOutput} readOnly className="font-mono text-xs bg-posthog-cream" />
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Regex Tool */}
        <TabsContent value="regex" className="space-y-4">
          <Card className="border-posthog-cream-dark bg-white">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 font-mono text-posthog-black">
                <Search className="h-5 w-5 text-brand-orange" />
                REGEX_TESTER
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <Label className="font-mono text-xs text-posthog-black">REGEX_PATTERN</Label>
                    <Input
                      value={regexPattern}
                      onChange={(e) => setRegexPattern(e.target.value)}
                      className="font-mono text-xs border-posthog-orange"
                      placeholder="Enter regex pattern..."
                    />
                  </div>
                  <div>
                    <Label className="font-mono text-xs text-posthog-black">FLAGS</Label>
                    <Input
                      value={regexFlags}
                      onChange={(e) => setRegexFlags(e.target.value)}
                      className="font-mono text-xs border-posthog-orange"
                      placeholder="g, i, m, s..."
                    />
                  </div>
                  <div>
                    <Label className="font-mono text-xs text-posthog-black">TEST_STRING</Label>
                    <Textarea
                      value={regexTestString}
                      onChange={(e) => setRegexTestString(e.target.value)}
                      className="font-mono text-xs border-posthog-orange"
                      rows={4}
                    />
                  </div>
                  <Button
                    onClick={testRegex}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-mono text-xs"
                  >
                    TEST_REGEX
                  </Button>
                </div>
                <div>
                  <Label className="font-mono text-xs text-posthog-black">MATCHES</Label>
                  {regexError ? (
                    <div className="text-red-600 text-xs font-mono mt-2">{regexError}</div>
                  ) : (
                    <div className="space-y-2 mt-2">
                      {regexMatches.length > 0 ? (
                        regexMatches.map((match, index) => (
                          <div key={index} className="p-2 bg-posthog-cream rounded font-mono text-xs">
                            <span className="text-posthog-gray">Match {index + 1}:</span> {match}
                          </div>
                        ))
                      ) : (
                        <div className="text-posthog-gray text-xs font-mono">No matches found</div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
