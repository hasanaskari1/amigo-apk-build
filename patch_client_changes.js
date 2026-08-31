const fs=require("fs");function readMust(p){if(!fs.existsSync(p))throw new Error("PATCH: file not found: "+p);return fs.readFileSync(p,"utf8")}function replaceOnce(src,needle,repl,label){const i=src.indexOf(needle);if(i===-1)throw new Error("PATCH: anchor not found ("+label+")");if(src.indexOf(needle,i+needle.length)!==-1)throw new Error("PATCH: anchor not unique ("+label+")");return src.slice(0,i)+repl+src.slice(i+needle.length)}const CHAT="src/screens/Ghost/CrowdChatScreen.js";let chat=readMust(CHAT);const startAnchor="  // ---- Ghost media: download-to-phone -----------------------------------";const endAnchor="  const [pinnedMessage, setPinnedMessage] = useState(null);";const s1=chat.indexOf(startAnchor);const e1=chat.indexOf(endAnchor);if(s1===-1)throw new Error("PATCH: ghost media start anchor missing");if(e1===-1||e1<s1)throw new Error("PATCH: ghost media end anchor missing");const GHOST_MEDIA=["  // ---- Ghost media: single-tap download with persistent cache ----------","  // WhatsApp-style: media shows as a placeholder with ONE download icon.","  // Tapping downloads the file once (saved to the phone gallery AND kept in","  // app storage). From then on - including after app restarts - the media","  // renders directly from the local copy with no icon and no re-download.","  const [mediaLocal, setMediaLocal] = useState({});","  const mediaLocalLoadedRef = useRef(false);","","  useEffect(() => {","    if (mediaLocalLoadedRef.current) return;","    mediaLocalLoadedRef.current = true;","    (async () => {","      try {","        const raw = await AsyncStorage.getItem('ghost_media_cache_v1');","        if (raw) setMediaLocal(JSON.parse(raw));","      } catch (_) {}","    })();","  }, []);","","  const handleDownloadMedia = async (url) => {","    if (!url || downloadingMedia.has(url) || mediaLocal[url]) return;","    setDownloadingMedia((prev) => new Set(prev).add(url));","    try {","      const clean =","        ((url.split('/').pop() || 'amigo_media').split('?')[0] || 'amigo_media').replace(","          /[^\\w.\\-]/g,","          '_',","        ) || 'amigo_media';","      const dir = FileSystem.documentDirectory || FileSystem.cacheDirectory || '';","      if (!dir) { setToastMsg('Storage unavailable'); return; }","      const localUri = dir + 'ghostmedia_' + clean;","      const res = await FileSystem.downloadAsync(toSafeMediaUrl(url), localUri);","      try {","        const perm = await MediaLibrary.requestPermissionsAsync();","        if (perm.granted) await MediaLibrary.saveToLibraryAsync(res.uri);","      } catch (_) {}","      const next = { ...mediaLocal, [url]: res.uri };","      setMediaLocal(next);","      try { await AsyncStorage.setItem('ghost_media_cache_v1', JSON.stringify(next)); } catch (_) {}","      setToastMsg('Saved to your phone');","    } catch (e) {","      setToastMsg('Could not download media');","    } finally {","      setDownloadingMedia((prev) => {","        const n = new Set(prev);","        n.delete(url);","        return n;","      });","    }","  };","","  // Placeholder (one icon) until downloaded; afterwards the local copy","  // renders directly - no icon, no re-download, survives app restarts.","  // Own messages (isOwn) always render directly: the sender already has","  // the file, so no download step is shown for their own media.","  const renderGhostMedia = (url, kind, isOwn) => {","    const localUri = mediaLocal[url];","    const busy = downloadingMedia.has(url);","    if (!localUri && !isOwn) {","      return (","        <View style={styles.mediaWrapper}>","          <TouchableOpacity","            style={[styles.messageMedia, styles.mediaPlaceholder]}","            onPress={() => handleDownloadMedia(url)}","            activeOpacity={0.85}>","            {busy ? (",'              <ActivityIndicator size="small" color="#FFFFFF" />',"            ) : (","              <View style={styles.mediaPlaceholderInner}>","                <View style={styles.mediaPlaceholderIcon}>","                  <DownloadIcon width={22} height={22} />","                </View>","                <Text style={styles.mediaPlaceholderText}>{kind === 'image' ? 'Photo' : 'Video'}</Text>","                <Text style={styles.mediaPlaceholderHint}>Tap to download</Text>","              </View>","            )}","          </TouchableOpacity>","        </View>","      );","    }","    const shownUri = localUri || url;","    return (","      <View style={styles.mediaWrapper}>","        {kind === 'image' ? (","          <TouchableOpacity onPress={() => setSelectedImageUri(shownUri)} activeOpacity={0.9}>",'            <Image source={{ uri: shownUri }} style={styles.messageMedia} resizeMode="cover" />',"          </TouchableOpacity>","        ) : (","          <VideoMessage uri={shownUri} />","        )}","      </View>","    );","  };",""].join("\n");chat=chat.slice(0,s1)+GHOST_MEDIA+chat.slice(e1);const STYLE_ANCHOR="  mediaWrapper: {";const NEW_STYLES=["  mediaPlaceholder: {","    backgroundColor: 'rgba(0,0,0,0.35)',","    alignItems: 'center',","    justifyContent: 'center',","    borderWidth: 1,","    borderColor: 'rgba(255,255,255,0.12)',","  },","  mediaPlaceholderInner: {","    alignItems: 'center',","    justifyContent: 'center',","  },","  mediaPlaceholderIcon: {","    width: 44,","    height: 44,","    borderRadius: 22,","    backgroundColor: 'rgba(0,0,0,0.55)',","    alignItems: 'center',","    justifyContent: 'center',","    marginBottom: 8,","  },","  mediaPlaceholderText: {","    color: '#FFFFFF',","    fontSize: 13,","    fontWeight: '600',","  },","  mediaPlaceholderHint: {","    color: 'rgba(255,255,255,0.7)',","    fontSize: 11,","    marginTop: 2,","  },",""].join("\n");chat=replaceOnce(chat,STYLE_ANCHOR,NEW_STYLES+STYLE_ANCHOR,"mediaWrapper style");const OWN_CALLS=["            {hasMedia && isImage && renderGhostMedia(message.media, 'image')}","            {isAudio && <AudioMessage uri={message.media} isCurrentUser={true} />}","            {isVideo && renderGhostMedia(message.media, 'video')}"].join("\n");const OWN_CALLS_NEW=["            {hasMedia && isImage && renderGhostMedia(message.media, 'image', true)}","            {isAudio && <AudioMessage uri={message.media} isCurrentUser={true} />}","            {isVideo && renderGhostMedia(message.media, 'video', true)}"].join("\n");chat=replaceOnce(chat,OWN_CALLS,OWN_CALLS_NEW,"own-message media calls");fs.writeFileSync(CHAT,chat);const COMP="src/component/chat-component/index.tsx";let comp=readMust(COMP);const IMPORT_ANCHOR="import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';";comp=replaceOnce(comp,IMPORT_ANCHOR,IMPORT_ANCHOR+"\nimport AsyncStorage from '@react-native-async-storage/async-storage';","react import");const MSG_ANCHOR="  const [msg, setMsg] = useState('');";const DRAFT_BLOCK=[MSG_ANCHOR,"","  // ---- Draft message saving (DMs / Groups / Channels) --------------------","  // Purely local input-state persistence - does not touch the message send","  // or encryption flow. If the user leaves the chat with unsent text, the","  // draft is restored on return; it clears naturally once the message is","  // sent (send handlers reset msg to empty, which removes the stored draft).","  const draftRoomId = itemData?.conversationId || itemData?._id || itemData?.id || '';","  const draftLoadedRef = useRef(false);","  useEffect(() => {","    if (!draftRoomId || draftLoadedRef.current) return;","    draftLoadedRef.current = true;","    (async () => {","      try {","        const d = await AsyncStorage.getItem('chat_draft_' + draftRoomId);","        if (d) setMsg((prev) => (prev && prev.length ? prev : d));","      } catch (_) {}","    })();","  }, [draftRoomId]);","  useEffect(() => {","    if (!draftRoomId) return;","    const t = setTimeout(() => {","      try {","        if (msg && msg.trim().length) {","          AsyncStorage.setItem('chat_draft_' + draftRoomId, msg);","        } else {","          AsyncStorage.removeItem('chat_draft_' + draftRoomId);","        }","      } catch (_) {}","    }, 300);","    return () => clearTimeout(t);","  }, [msg, draftRoomId]);"].join("\n");comp=replaceOnce(comp,MSG_ANCHOR,DRAFT_BLOCK,"msg state");fs.writeFileSync(COMP,comp);const DOC="src/utils/openDocument.ts";let doc=readMust(DOC);const LOCAL_ANCHOR="    const localUri = (FileSystem.cacheDirectory || '') + cleanName;";const LOCAL_REPL=["    const baseDir = FileSystem.cacheDirectory || FileSystem.documentDirectory || '';","    if (!baseDir) {","      Alert.alert('Error', 'Storage unavailable on this device.');","      return;","    }","    const localUri = baseDir + cleanName;"].join("\n");doc=replaceOnce(doc,LOCAL_ANCHOR,LOCAL_REPL,"openDocument localUri");const UTI_ANCHOR="        UTI: undefined,";const UTI_REPL="        UTI: utiFromName(cleanName),";doc=replaceOnce(doc,UTI_ANCHOR,UTI_REPL,"openDocument UTI");const MIME_IMPORT_ANCHOR="import {mimeFromName} from './mediaUrl';";const UTI_HELPER=[MIME_IMPORT_ANCHOR,"","// iOS Uniform Type Identifier for common document types. Supplying the UTI","// lets the iOS share sheet identify the file so Quick Look previews it","// directly instead of only offering an app-selection list.","const utiFromName = (name: string): string | undefined => {","  const ext = (name.split('.').pop() || '').toLowerCase();","  const map: {[k: string]: string} = {","    pdf: 'com.adobe.pdf',","    doc: 'com.microsoft.word.doc',","    docx: 'org.openxmlformats.wordprocessingml.document',","    xls: 'com.microsoft.excel.xls',","    xlsx: 'org.openxmlformats.spreadsheetml.sheet',","    ppt: 'com.microsoft.powerpoint.ppt',","    pptx: 'org.openxmlformats.presentationml.presentation',","    txt: 'public.plain-text',","    csv: 'public.comma-separated-values-text',","    png: 'public.png',","    jpg: 'public.jpeg',","    jpeg: 'public.jpeg',","    gif: 'com.compuserve.gif',","    mp4: 'public.mpeg-4',","    mov: 'com.apple.quicktime-movie',","    mp3: 'public.mp3',","    zip: 'public.zip-archive',","  };","  return map[ext];","};"].join("\n");doc=replaceOnce(doc,MIME_IMPORT_ANCHOR,UTI_HELPER,"mime import");fs.writeFileSync(DOC,doc);console.log("PATCH v2: ghost media cache + app-wide drafts + doc-open hardening applied");const PLIST="ios/Amigo/Info.plist";const IOS_VERSION="1.5";const IOS_BUILD="54";if(fs.existsSync(PLIST)){let plist=fs.readFileSync(PLIST,"utf8");const re=/(<key>CFBundleVersion<\/key>\s*<string>)[^<]*(<\/string>)/;if(!re.test(plist))throw new Error("PATCH: CFBundleVersion not found in Info.plist");plist=plist.replace(re,"$1"+IOS_BUILD+"$2");const reSV=/(<key>CFBundleShortVersionString<\/key>\s*<string>)[^<]*(<\/string>)/;if(!reSV.test(plist))throw new Error("PATCH: CFBundleShortVersionString not found in Info.plist");plist=plist.replace(reSV,"$1"+IOS_VERSION+"$2");fs.writeFileSync(PLIST,plist);console.log("PATCH: iOS version -> "+IOS_VERSION+" ("+IOS_BUILD+")")}const GRADLE="android/app/build.gradle";const ANDROID_VC="18";if(fs.existsSync(GRADLE)){let g=fs.readFileSync(GRADLE,"utf8");const reVC=/versionCode\s+\d+/;if(!reVC.test(g))throw new Error("PATCH: versionCode not found in build.gradle");g=g.replace(reVC,"versionCode "+ANDROID_VC);fs.writeFileSync(GRADLE,g);console.log("PATCH: Android versionCode -> "+ANDROID_VC)}if(process.env.NO_LOGIN_FLOW==="1"){const MODE="src/screens/Ghost/ChooseModeScreen.js";let mode=readMust(MODE);mode=replaceOnce(mode,"const SHOW_LOGIN_FLOW = true;","const SHOW_LOGIN_FLOW = false;","SHOW_LOGIN_FLOW");fs.writeFileSync(MODE,mode);console.log("PATCH: SHOW_LOGIN_FLOW -> false (store build)")}const ENTITLEMENTS="ios/Amigo/Amigo.entitlements";if(fs.existsSync(ENTITLEMENTS)){let ent=readMust(ENTITLEMENTS);if(ent.includes("<string>development</string>")){ent=replaceOnce(ent,"<string>development</string>","<string>production</string>","aps-environment");fs.writeFileSync(ENTITLEMENTS,ent);console.log("PATCH: aps-environment -> production (iOS push fix)")}}if(fs.existsSync(PLIST)){let plist2=fs.readFileSync(PLIST,"utf8");if(!plist2.includes("ITSAppUsesNonExemptEncryption")){plist2=replaceOnce(plist2,"	<key>CFBundleVersion</key>","	<key>ITSAppUsesNonExemptEncryption</key>\n	<false/>\n	<key>CFBundleVersion</key>","compliance key");fs.writeFileSync(PLIST,plist2);console.log("PATCH: ITSAppUsesNonExemptEncryption=false added")}}{const CHAT2="src/screens/Ghost/CrowdChatScreen.js";let c2=readMust(CHAT2);c2=replaceOnce(c2,"        // Get crowd info to determine if user is creator/admin and chat lock status\n        const crowdInfoResponse = await getCrowdInfo(crowdId, id);",["        // Get crowd info to determine if user is creator/admin and chat lock status.","        // Offline-safe: a network failure must NOT abort the mount flow, otherwise","        // cached messages never render. Fall through with status 0 instead.","        let crowdInfoResponse = { status: 0, data: null };","        try {","          crowdInfoResponse = await getCrowdInfo(crowdId, id);","        } catch (_) {}"].join("\n"),"crowdInfo offline guard");c2=replaceOnce(c2,"  const [typingUsers, setTypingUsers] = useState([]);",["  const [typingUsers, setTypingUsers] = useState([]);","","  // Keep the local message cache fresh: whenever messages change (socket","  // receives, deletes, blocks), persist the latest 50 real messages so they","  // are available instantly - and offline - on the next open.","  useEffect(() => {","    if (!crowdId || !messages.length) return;","    const t = setTimeout(() => {","      try {","        const real = messages.filter(m => m && m.messageId && !String(m.messageId).startsWith('temp_') && m.messageId !== 'history_expiration_system');","        if (real.length) AsyncStorage.setItem('ghost_msgs_' + crowdId, JSON.stringify(real.slice(-50)));","      } catch (_) {}","    }, 500);","    return () => clearTimeout(t);","  }, [messages, crowdId]);"].join("\n"),"message cache keep-fresh");fs.writeFileSync(CHAT2,c2);console.log("PATCH: ghost chat offline cache hardened")}{const MEM="src/screens/Ghost/CrowdMembersScreen.js";let mem=readMust(MEM);mem=replaceOnce(mem,"import { getCrowdMembers, updateAdminStatus, removeMember } from '../../apis/ghost';","import { getCrowdMembers, updateAdminStatus, removeMember } from '../../apis/ghost';\nimport AsyncStorage from '@react-native-async-storage/async-storage';","members AsyncStorage import");mem=replaceOnce(mem,"  const [members, setMembers] = useState([]);","  const [members, setMembers] = useState([]);\n  const [visibleMembersCount, setVisibleMembersCount] = useState(50);","members visible count state");mem=replaceOnce(mem,"        const response = await getCrowdMembers(crowdId, id);",["        // Local cache: show the last known members list instantly (and offline)","        // while the fresh list is fetched in the background.","        try {","          const cachedRaw = await AsyncStorage.getItem('ghost_members_' + crowdId);","          if (cachedRaw) {","            const cachedList = JSON.parse(cachedRaw);","            if (Array.isArray(cachedList) && cachedList.length > 0) {","              setMembers(cachedList.map(m => ({ ...m, joinedAt: new Date(m.joinedAt), isCurrentUser: m.deviceId === id })));","              cachedList.forEach(m => { if (m.deviceId === id) { setCurrentUserIsAdmin(!!m.isAdmin); setCurrentUserIsCreator(!!m.isCreator); } });","              setIsLoading(false);","            }","          }","        } catch (_) {}","","        const response = await getCrowdMembers(crowdId, id);"].join("\n"),"members cache hydrate");mem=replaceOnce(mem,"          setMembers(updatedMembers);","          setMembers(updatedMembers);\n          try { AsyncStorage.setItem('ghost_members_' + crowdId, JSON.stringify(updatedMembers)); } catch (_) {}","members cache write");mem=replaceOnce(mem,"            members.map(renderMember)",["            <>","              {members.slice(0, visibleMembersCount).map(renderMember)}","              {members.length > visibleMembersCount && (","                <TouchableOpacity","                  style={styles.loadMoreButton}","                  onPress={() => setVisibleMembersCount(c => c + 50)}","                  activeOpacity={0.8}>","                  <Text style={styles.loadMoreText}>","                    Load more ({members.length - visibleMembersCount} remaining)","                  </Text>","                </TouchableOpacity>","              )}","            </>"].join("\n"),"members paginated render");mem=replaceOnce(mem,"  memberCount: {",["  loadMoreButton: {","    marginTop: 12,","    marginBottom: 8,","    paddingVertical: 12,","    borderRadius: 12,","    backgroundColor: 'rgba(155,123,255,0.12)',","    alignItems: 'center',","  },","  loadMoreText: {","    color: '#9B7BFF',","    fontSize: 14,","    fontWeight: '600',","  },","  memberCount: {"].join("\n"),"members loadMore styles");fs.writeFileSync(MEM,mem);console.log("PATCH: crowd members cache + pagination added")}{const HOME="src/screens/Ghost/GhostModeHomeScreen.js";let home=readMust(HOME);home=replaceOnce(home,"import { getActiveCrowds, getCrowdInfo } from '../../apis/ghost';","import { getActiveCrowds, getCrowdInfo } from '../../apis/ghost';\nimport AsyncStorage from '@react-native-async-storage/async-storage';","home AsyncStorage import");home=replaceOnce(home,"      const response = await getActiveCrowds(deviceId);\n\n      if (response.status === 200 && response.data) {\n        _crowdsCache = response.data;\n        setActiveCrowds(response.data);\n      }",["      // Local cache: show the last known crowds instantly (works offline and","      // across app restarts) while a fresh list is fetched in the background.","      if (_crowdsCache.length === 0) {","        try {","          const cachedRaw = await AsyncStorage.getItem('ghost_crowds_cache_v1');","          if (cachedRaw) {","            const cachedList = JSON.parse(cachedRaw);","            if (Array.isArray(cachedList) && cachedList.length > 0) {","              _crowdsCache = cachedList;","              setActiveCrowds(cachedList);","              setIsLoading(false);","            }","          }","        } catch (_) {}","      }","","      const response = await getActiveCrowds(deviceId);","","      if (response.status === 200 && response.data) {","        _crowdsCache = response.data;","        setActiveCrowds(response.data);","        try { AsyncStorage.setItem('ghost_crowds_cache_v1', JSON.stringify(response.data)); } catch (_) {}","      }"].join("\n"),"active crowds cache");fs.writeFileSync(HOME,home);console.log("PATCH: active crowds persistent cache added")}{const CHAT3="src/screens/Ghost/CrowdChatScreen.js";let c3=readMust(CHAT3);c3=replaceOnce(c3,"        let crowdInfoResponse = { status: 0, data: null };",["        // Instant cache render: show cached messages BEFORE any network call","        // or socket wait, so the chat opens immediately - and offline - on","        // all platforms. loadMessages() later refreshes from the API.","        try {","          const cachedRaw0 = await AsyncStorage.getItem('ghost_msgs_' + crowdId);","          if (cachedRaw0) {","            const cached0 = JSON.parse(cachedRaw0);","            if (Array.isArray(cached0) && cached0.length > 0) {","              setMessages(prev => (prev.length ? prev : cached0.map(m => ({ ...m, timestamp: new Date(m.timestamp) }))));","              setIsLoadingMessages(false);","            }","          }","        } catch (_) {}","","        let crowdInfoResponse = { status: 0, data: null };"].join("\n"),"instant cache render");c3=replaceOnce(c3,"    } catch (error) {\n      console.error('Error loading more messages:', error);\n    } finally {\n      setIsLoadingMore(false);\n    }",["    } catch (error) {","      console.error('Error loading more messages:', error);","      // Offline/failed fetch: stop retrying until the chat is reopened -","      // prevents the endless spinner blink when onEndReached keeps firing","      // on a short cached list while the network is unavailable.","      hasMoreMessagesRef.current = false;","      setHasMoreMessages(false);","    } finally {","      setIsLoadingMore(false);","    }"].join("\n"),"load-more retry stop");fs.writeFileSync(CHAT3,c3);console.log("PATCH: ghost chat instant cache render + load-more retry stop")}{const WALLET="src/screen/wallet-screen/index.tsx";let w=readMust(WALLET);w=replaceOnce(w,"import Reanimated, { Layout } from 'react-native-reanimated';","import Reanimated, { LinearTransition } from 'react-native-reanimated';","wallet reanimated import");w=replaceOnce(w,"                  layout={Layout.springify()}","                  layout={LinearTransition.springify()}","wallet layout prop");fs.writeFileSync(WALLET,w);console.log("PATCH: wallet Reanimated v4 crash fixed (Layout -> LinearTransition)")}{const WALLET2="src/screen/wallet-screen/index.tsx";let w2=readMust(WALLET2);w2=replaceOnce(w2,"import Reanimated, { LinearTransition } from 'react-native-reanimated';\n","","wallet reanimated import removal");w2=replaceOnce(w2,"const AnimatedPressable = Reanimated.createAnimatedComponent(Pressable);\n","","wallet AnimatedPressable removal");w2=replaceOnce(w2,"                <AnimatedPressable\n                  layout={LinearTransition.springify()}\n","                <Pressable\n","wallet item opening tag");w2=replaceOnce(w2,"                </AnimatedPressable>","                </Pressable>","wallet item closing tag");fs.writeFileSync(WALLET2,w2);console.log("PATCH: wallet layout animation removed (reanimated-free wallet)")}{const NAV="src/navigation/index.tsx";let nav=readMust(NAV);const STUB=["    NotificationListener((data: any) => {","      if (data?.chatType && data?.chatId) {","        // Navigate based on notification data","        console.log('Navigate to chat:', data);","      }","    });"].join("\n");const REAL=["    NotificationListener((data: any) => {","      console.log('Notification tapped, payload:', JSON.stringify(data || {}));","      try {","        // Ghost crowd push: accept any key spelling the backend may use.","        const crowdId =","          data?.crowdId || data?.crowd_id || data?.crowdID ||","          (data?.type === 'crowd' || data?.chatType === 'crowd' ? data?.chatId || data?.id : null);","        if (crowdId) {","          const crowdName = data?.crowdName || data?.crowd_name || data?.title || '';","          // Ghost identity comes from local storage so the chat screen","          // opens fully populated exactly like tapping the crowd tile.","          getGhostLogin()","            .then((g: any) => {","              navigationRef.current?.navigate('CrowdChatScreen', {","                crowdId: String(crowdId),","                crowdName,","                ghostName: g?.ghostName || '',","                avatarBgColor: g?.avatarBgColor || '#155DFC',","                isCreator: false,","              });","            })","            .catch(() => {","              navigationRef.current?.navigate('CrowdChatScreen', {","                crowdId: String(crowdId),","                crowdName,","                isCreator: false,","              });","            });","          return;","        }","      } catch (_) {}","    });"].join("\n");nav=replaceOnce(nav,STUB,REAL,"notification tap stub");if(!/import\s*\{[^}]*getGhostLogin[^}]*\}\s*from/.test(nav)){throw new Error("PATCH: expected getGhostLogin import missing from navigator")}fs.writeFileSync(NAV,nav);console.log("PATCH: notification tap now opens the crowd (was a console.log stub)")}{const WALLET3="src/screen/wallet-screen/index.tsx";let w3=readMust(WALLET3);w3=replaceOnce(w3,"const WalletScreen = () => {",["// Crash containment: any render/lifecycle error inside the wallet is","// caught here and shown on screen instead of taking the whole app down.","class WalletErrorBoundary extends React.Component {","  constructor(props) {","    super(props);","    this.state = { error: null };","  }","  static getDerivedStateFromError(error) {","    return { error };","  }","  componentDidCatch(error, info) {","    console.log('WALLET ERROR:', String(error), info && info.componentStack);","  }","  render() {","    if (this.state.error) {","      return (","        <SafeAreaView style={{ flex: 1, backgroundColor: '#0A0A14' }}>","          <View style={{ flex: 1, padding: 24, justifyContent: 'center' }}>","            <Text style={{ color: '#fff', fontSize: 18, fontWeight: '700', marginBottom: 12 }}>","              Wallet could not open","            </Text>","            <Text selectable style={{ color: '#FF8A8A', fontSize: 13, marginBottom: 16 }}>","              {String(this.state.error && this.state.error.message ? this.state.error.message : this.state.error)}","            </Text>","            <Text style={{ color: '#8B8CAD', fontSize: 12 }}>","              Please screenshot this screen and send it to the developer.","            </Text>","          </View>","        </SafeAreaView>","      );","    }","    return this.props.children;","  }","}","","const WalletScreenInner = () => {"].join("\n"),"wallet error boundary class");w3=replaceOnce(w3,"export default WalletScreen;",["const WalletScreen = () => (","  <WalletErrorBoundary>","    <WalletScreenInner />","  </WalletErrorBoundary>",");","","export default WalletScreen;"].join("\n"),"wallet boundary wrapper");fs.writeFileSync(WALLET3,w3);console.log("PATCH: wallet wrapped in error boundary (shows real error instead of crashing)")}{const MISSING=[{file:"src/screen/wallet-screen/index.tsx",find:"  Pressable,\n  ScrollView,\n",repl:"  Pressable,\n  ScrollView,\n  TouchableOpacity,\n",what:"wallet TouchableOpacity (CONFIRMED crash)"},{file:"src/screen/create-group-channel/group-type/index.tsx",find:"import { Pressable,  View } from 'react-native'\n",repl:"import { Pressable,  View } from 'react-native'\nimport { SafeAreaView } from 'react-native-safe-area-context'\n",what:"group/channel type screen SafeAreaView"},{file:"src/screen/profile/dm-profile-screen/profileview.tsx",find:"import { Image, Platform, Pressable,  TouchableOpacity, View } from 'react-native'\n",repl:"import { Image, Platform, Pressable,  TouchableOpacity, View } from 'react-native'\nimport { SafeAreaView } from 'react-native-safe-area-context'\n",what:"DM profile SafeAreaView"},{file:"src/screen/shareit-screen/index.tsx",find:"import { Animated, Dimensions, FlatList, Linking, Modal, Platform, Pressable,  TouchableOpacity, View } from 'react-native'\n",repl:"import { Animated, Dimensions, FlatList, Linking, Modal, Platform, Pressable,  TouchableOpacity, View } from 'react-native'\nimport { SafeAreaView } from 'react-native-safe-area-context'\n",what:"ShareIt screen SafeAreaView"},{file:"src/screens/Chanel/ChanelChatBox.js",find:"import { SafeAreaView } from 'react-native-safe-area-context';\n",repl:"import { SafeAreaView } from 'react-native-safe-area-context';\nimport RNVoiceMessagePlayer from '@carchaze/react-native-voice-message-player';\n",what:"channel chat voice player"},{file:"src/screens/Group/GroupChatBox.js",find:"import { SafeAreaView } from 'react-native-safe-area-context';\n",repl:"import { SafeAreaView } from 'react-native-safe-area-context';\nimport RNVoiceMessagePlayer from '@carchaze/react-native-voice-message-player';\n",what:"group chat voice player"}];MISSING.forEach(({file,find,repl,what})=>{let s=readMust(file);s=replaceOnce(s,find,repl,`missing import: ${what}`);fs.writeFileSync(file,s);console.log(`PATCH: added missing import -> ${what}`)})}{const NAV2="src/navigation/index.tsx";let n2=readMust(NAV2);n2=replaceOnce(n2,"import { NotificationListener, removeNotificationListeners, requestUserPermission } from '../utils/notification';","import { NotificationListener, removeNotificationListeners, requestUserPermission, clearBadgeCount } from '../utils/notification';","badge import");n2=replaceOnce(n2,["    const handleAppStateChange = (nextAppState: string) => {","      if (nextAppState === 'background' && socketServics.getConnectionStatus()) {","        socketServics.emit('Disconnect');","      }","    };"].join("\n"),["    const handleAppStateChange = (nextAppState: string) => {","      if (nextAppState === 'background' && socketServics.getConnectionStatus()) {","        socketServics.emit('Disconnect');","      }","      if (nextAppState === 'active') {","        // Opening / returning to the app means the user has seen it.","        clearBadgeCount();","      }","    };","    // Already foregrounded at mount (e.g. cold start from a notification).","    clearBadgeCount();"].join("\n"),"badge clear on foreground");fs.writeFileSync(NAV2,n2);console.log("PATCH: app-icon badge now clears on foreground (was never cleared)")}{const RULES_PATH="src/screens/Ghost/GhostRulesScreen.js";const RULES_SRC=`import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { FontFamily } from '../../../GlobalStyles';
import CloseIcon from '../../assets/svg/CloseIcon';
import ShieldIcon from '../../assets/svg/ShieldIcon';
import AlertTriangleIcon from '../../assets/svg/AlertTriangleIcon';
import CheckIcon from '../../assets/svg/CheckIcon';
import ClockIcon from '../../assets/svg/ClockIcon';
import FlagIcon from '../../assets/svg/FlagIcon';
import LockIcon from '../../assets/svg/LockIcon';
import GhostIcon from '../../assets/svg/GhostIcon';

// Static, text-and-icons-only screen. No features, no side effects.
const RULES = [
  {
    Icon: ShieldIcon,
    color: '#FF6363',
    title: 'Zero Tolerance',
    description:
      'No harassment, hate speech, threats, sexual content involving minors, or illegal activity. Violations result in an immediate permanent ban.',
  },
  {
    Icon: GhostIcon,
    color: '#9B7BFF',
    title: 'Stay Anonymous',
    description:
      'Never share your real name, phone number, address, or any personal details - yours or anyone else\u2019s. Ghost Mode only works if everyone stays a ghost.',
  },
  {
    Icon: ClockIcon,
    color: '#60A5FA',
    title: 'Crowds Are Temporary',
    description:
      'Every crowd expires. When it does, the chat and its media are gone for good. Save anything you need before the timer runs out.',
  },
  {
    Icon: LockIcon,
    color: '#22C55E',
    title: 'Respect Privacy',
    description:
      'Do not screenshot, record, or repost what other people share in a crowd. What happens in a crowd stays in the crowd.',
  },
  {
    Icon: AlertTriangleIcon,
    color: '#F59E0B',
    title: 'No Spam or Scams',
    description:
      'No advertising, phishing, promotional links, or attempts to move people off-platform for money.',
  },
  {
    Icon: FlagIcon,
    color: '#FF6363',
    title: 'Report Anything Harmful',
    description:
      'Use the report tool on any message or crowd that breaks these rules. Reports are anonymous and reviewed by moderators.',
  },
  {
    Icon: CheckIcon,
    color: '#22C55E',
    title: 'Be Decent',
    description:
      'Treat every ghost the way you would want to be treated. Anonymity is not an excuse to be cruel.',
  },
];

const GhostRulesScreen = ({ navigation }) => {
  return (
    <SafeAreaView edges={['left', 'right']} style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Ghost Rules</Text>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.closeButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <CloseIcon width={24} height={24} strokeColor="#8B8CAD" />
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          {/* Intro */}
          <View style={styles.intro}>
            <View style={styles.introIconWrapper}>
              <LinearGradient
                colors={['#9B7BFF', '#7B5BCF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.introIconGradient}>
                <GhostIcon width={32} height={32} strokeColor="#FFFFFF" />
              </LinearGradient>
            </View>
            <Text style={styles.introTitle}>The rules of Ghost Mode</Text>
            <Text style={styles.introSubtitle}>
              Ghost Mode is anonymous, not lawless. These rules keep every crowd
              safe.
            </Text>
          </View>

          {/* Rules */}
          <View style={styles.rulesContainer}>
            {RULES.map((rule, index) => {
              const { Icon, color, title, description } = rule;
              return (
                <View key={title} style={styles.ruleCard}>
                  <View
                    style={[
                      styles.ruleIconCircle,
                      { backgroundColor: \`\${color}22\` },
                    ]}>
                    <Icon width={20} height={20} color={color} strokeColor={color} />
                  </View>
                  <View style={styles.ruleContent}>
                    <Text style={styles.ruleTitle}>
                      {index + 1}. {title}
                    </Text>
                    <Text style={styles.ruleDescription}>{description}</Text>
                  </View>
                </View>
              );
            })}
          </View>

          {/* Footer note */}
          <View style={styles.footerCard}>
            <Text style={styles.footerText}>
              Breaking these rules can get you removed from a crowd or banned
              from <Text style={styles.footerHighlight}>Ghost Mode</Text>{' '}
              permanently.
            </Text>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0A0A14' },
  container: { flex: 1, backgroundColor: '#0A0A14' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: FontFamily.interRegular,
  },
  closeButton: { padding: 4 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  intro: { alignItems: 'center', marginTop: 8, marginBottom: 28 },
  introIconWrapper: { marginBottom: 16 },
  introIconGradient: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  introTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
    fontFamily: FontFamily.interRegular,
  },
  introSubtitle: {
    fontSize: 14,
    color: '#8B8CAD',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 12,
    fontFamily: FontFamily.interRegular,
  },
  rulesContainer: { gap: 12 },
  ruleCard: {
    flexDirection: 'row',
    backgroundColor: '#151521',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  ruleIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  ruleContent: { flex: 1 },
  ruleTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 6,
    fontFamily: FontFamily.interRegular,
  },
  ruleDescription: {
    fontSize: 13,
    color: '#A9C2D0',
    lineHeight: 19,
    fontFamily: FontFamily.interRegular,
  },
  footerCard: {
    marginTop: 20,
    backgroundColor: 'rgba(155, 123, 255, 0.1)',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(155, 123, 255, 0.25)',
  },
  footerText: {
    fontSize: 13,
    color: '#C9C9DD',
    lineHeight: 19,
    textAlign: 'center',
    fontFamily: FontFamily.interRegular,
  },
  footerHighlight: { color: '#9B7BFF', fontWeight: '700' },
});

export default GhostRulesScreen;
`;fs.writeFileSync(RULES_PATH,RULES_SRC);console.log("PATCH: created GhostRulesScreen.js");const NAV3="src/navigation/index.tsx";let n3=readMust(NAV3);n3=replaceOnce(n3,"import GhostSettingsScreen from '../screens/Ghost/GhostSettingsScreen';","import GhostSettingsScreen from '../screens/Ghost/GhostSettingsScreen';\nimport GhostRulesScreen from '../screens/Ghost/GhostRulesScreen';","ghost rules import");n3=replaceOnce(n3,["      <Stack.Screen","        name={'GhostSettingsScreen' as any}","        component={GhostSettingsScreen}","      />"].join("\n"),["      <Stack.Screen","        name={'GhostSettingsScreen' as any}","        component={GhostSettingsScreen}","      />","      <Stack.Screen","        name={'GhostRulesScreen' as any}","        component={GhostRulesScreen}","      />"].join("\n"),"ghost rules route");fs.writeFileSync(NAV3,n3);console.log("PATCH: registered GhostRulesScreen route");const GSET="src/screens/Ghost/GhostSettingsScreen.js";let g=readMust(GSET);g=replaceOnce(g,"          {/* Legal Section */}",["          {/* Ghost Rules Section */}","          <View style={styles.section}>","            <Text style={styles.sectionHeader}>Community</Text>","            <View style={styles.itemsContainer}>","              <SettingItem","                icon={InfoIcon}",'                iconColor="#9B7BFF"','                title="Ghost Rules"','                description="The rules every ghost agrees to follow"',"                onPress={() => navigation.navigate('GhostRulesScreen')}","              />","            </View>","          </View>","","          {/* Legal Section */}"].join("\n"),"ghost rules settings entry");fs.writeFileSync(GSET,g);console.log("PATCH: added Settings -> Ghost Rules entry")}
